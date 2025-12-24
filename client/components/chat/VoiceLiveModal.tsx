import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { createLiveApiClient } from '@/lib/live';
import type { LiveApiClient } from '@/lib/live';
import { toast } from 'sonner';

interface VoiceLiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Audio player for Live API PCM output (24kHz, 16-bit, mono)
class AudioPlayer {
    private audioContext: AudioContext | null = null;
    private audioQueue: AudioBuffer[] = [];
    private isPlaying = false;
    private nextPlayTime = 0;
    private currentSource: AudioBufferSourceNode | null = null;

    private getContext(): AudioContext {
        if (!this.audioContext || this.audioContext.state === 'closed') {
            this.audioContext = new AudioContext({ sampleRate: 24000 });
        }
        return this.audioContext;
    }

    async play(base64Audio: string): Promise<void> {
        const ctx = this.getContext();

        // Resume context if suspended
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        // Decode base64 to ArrayBuffer
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Convert Int16 to Float32
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768;
        }

        // Create AudioBuffer
        const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
        audioBuffer.getChannelData(0).set(float32Array);

        // Queue and play
        this.audioQueue.push(audioBuffer);
        if (!this.isPlaying) {
            this.playQueue();
        }
    }

    private playQueue(): void {
        if (this.audioQueue.length === 0) {
            this.isPlaying = false;
            return;
        }

        this.isPlaying = true;
        const ctx = this.getContext();
        const buffer = this.audioQueue.shift()!;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        const startTime = Math.max(ctx.currentTime, this.nextPlayTime);
        source.start(startTime);
        this.nextPlayTime = startTime + buffer.duration;
        this.currentSource = source;

        source.onended = () => {
            this.currentSource = null;
            this.playQueue();
        };
    }

    stop(): void {
        this.audioQueue = [];
        if (this.currentSource) {
            try {
                this.currentSource.stop();
            } catch {
                // Ignore if already stopped
            }
            this.currentSource = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.isPlaying = false;
        this.nextPlayTime = 0;
    }

    get playing(): boolean {
        return this.isPlaying;
    }
}

export const VoiceLiveModal = memo(function VoiceLiveModal({
    isOpen,
    onClose
}: VoiceLiveModalProps) {
    const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'ready'>('disconnected');
    const [isListening, setIsListening] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [audioLevel, setAudioLevel] = useState(0);

    const liveClientRef = useRef<LiveApiClient | null>(null);
    const audioPlayerRef = useRef<AudioPlayer | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    // Generate elegant wave bars
    const waveBarCount = 24;
    const generateWaveBars = () => {
        return Array.from({ length: waveBarCount }, (_, i) => ({
            delay: i * 0.03,
            baseHeight: 8 + Math.random() * 16
        }));
    };
    const [waveBars] = useState(generateWaveBars);

    // Cleanup function
    const cleanup = useCallback(() => {
        // Stop listening
        setIsListening(false);
        setIsAiSpeaking(false);

        // Stop animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Stop audio processing
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        // Stop media stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Close audio context
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // Stop audio player
        if (audioPlayerRef.current) {
            audioPlayerRef.current.stop();
            audioPlayerRef.current = null;
        }

        // Disconnect Live API
        if (liveClientRef.current) {
            liveClientRef.current.disconnect();
            liveClientRef.current = null;
        }

        setConnectionState('disconnected');
        setTranscript('');
        setAiResponse('');
        setAudioLevel(0);
    }, []);

    // Connect to Live API
    const connect = useCallback(async () => {
        setConnectionState('connecting');

        try {
            // Create audio player
            audioPlayerRef.current = new AudioPlayer();

            // Create Live API client
            const client = createLiveApiClient({
                model: 'gemini-2.5-flash-native-audio-preview',
                voice: 'Kore',
                systemInstruction: 'Kamu adalah asisten AI yang ramah dan membantu. Bicara dalam bahasa Indonesia dengan sopan dan jelas. Jawab dengan ringkas.',
                onConnect: () => {
                    console.log('[VoiceLive] Connected to server');
                },
                onSetupComplete: () => {
                    console.log('[VoiceLive] Setup complete, ready for conversation');
                    setConnectionState('ready');
                },
                onAudioResponse: (base64Audio) => {
                    // Stop user's mic when AI is speaking
                    setIsAiSpeaking(true);
                    audioPlayerRef.current?.play(base64Audio);
                },
                onTextResponse: (text) => {
                    setAiResponse(prev => prev + text);
                },
                onTurnComplete: () => {
                    // AI finished speaking, can listen again
                    setIsAiSpeaking(false);
                },
                onError: (error) => {
                    console.error('[VoiceLive] Error:', error);
                    toast.error(error.message || 'Connection error');
                },
                onDisconnect: (reason) => {
                    console.log('[VoiceLive] Disconnected:', reason);
                    setConnectionState('disconnected');
                }
            });

            liveClientRef.current = client;

            // Connect and setup session
            await client.connect();
            setConnectionState('connected');
            client.setupSession();

        } catch (error) {
            console.error('[VoiceLive] Connection failed:', error);
            toast.error('Gagal terhubung ke Live API');
            setConnectionState('disconnected');
        }
    }, []);

    // Start listening (send audio to AI)
    const startListening = useCallback(async () => {
        if (!liveClientRef.current?.isReady()) {
            toast.error('Belum terhubung ke AI');
            return;
        }

        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            });
            streamRef.current = stream;

            // Create AudioContext for processing at 16kHz
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);

            // Create analyser for visualization
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 128;
            source.connect(analyserRef.current);

            // Create processor for sending audio to Live API
            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

            processorRef.current.onaudioprocess = (e) => {
                // Don't send audio while AI is speaking
                if (isAiSpeaking) return;

                const inputData = e.inputBuffer.getChannelData(0);
                // Convert float32 to int16
                const int16Data = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
                }
                // Convert to base64
                const base64 = btoa(String.fromCharCode(...new Uint8Array(int16Data.buffer)));
                liveClientRef.current?.sendRealtimeInput({
                    audio: {
                        data: base64,
                        mimeType: 'audio/pcm;rate=16000'
                    }
                });
            };

            source.connect(processorRef.current);
            processorRef.current.connect(audioContextRef.current.destination);

            // Update audio level visualization
            const updateAudioLevel = () => {
                if (analyserRef.current) {
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                    setAudioLevel(average / 255);
                }
                animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            };
            updateAudioLevel();

            setIsListening(true);
            setAiResponse('');

        } catch (error) {
            console.error('[VoiceLive] Error starting microphone:', error);
            toast.error('Tidak bisa mengakses mikrofon');
        }
    }, [isAiSpeaking]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setIsListening(false);
        setAudioLevel(0);
    }, []);

    // Effect: Connect when modal opens
    useEffect(() => {
        if (isOpen) {
            connect();
        } else {
            cleanup();
        }

        return cleanup;
    }, [isOpen, connect, cleanup]);

    if (!isOpen) return null;

    const isConnected = connectionState === 'ready';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md rounded-3xl overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#111111] border border-white/10 shadow-2xl"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/3" />

                {/* Glow when active */}
                {(isListening || isAiSpeaking) && (
                    <motion.div
                        className="absolute inset-0 rounded-3xl"
                        animate={{
                            boxShadow: isAiSpeaking
                                ? [
                                    'inset 0 0 60px rgba(0, 255, 136, 0.1)',
                                    'inset 0 0 80px rgba(0, 255, 136, 0.15)',
                                    'inset 0 0 60px rgba(0, 255, 136, 0.1)'
                                ]
                                : [
                                    'inset 0 0 60px rgba(255, 215, 0, 0.1)',
                                    'inset 0 0 80px rgba(255, 215, 0, 0.15)',
                                    'inset 0 0 60px rgba(255, 215, 0, 0.1)'
                                ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors",
                                isAiSpeaking
                                    ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/20"
                                    : "bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[#FFD700]/20"
                            )}>
                                <Volume2 className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white text-lg">Live Voice</h2>
                                <p className="text-xs text-gray-500">
                                    {connectionState === 'connecting' && 'Menghubungkan...'}
                                    {connectionState === 'connected' && 'Menyiapkan...'}
                                    {connectionState === 'ready' && (isAiSpeaking ? 'AI Berbicara' : 'Siap')}
                                    {connectionState === 'disconnected' && 'Terputus'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Voice Visualization Area */}
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        {/* Waveform */}
                        <div className="flex items-center justify-center gap-1 h-20 mb-8">
                            {waveBars.map((bar, i) => (
                                <motion.div
                                    key={i}
                                    className={cn(
                                        "w-1 rounded-full transition-colors duration-300",
                                        isAiSpeaking
                                            ? "bg-gradient-to-t from-green-400/80 to-green-400"
                                            : isListening
                                                ? "bg-gradient-to-t from-[#FFD700]/80 to-[#FFD700]"
                                                : "bg-white/10"
                                    )}
                                    animate={{
                                        height: (isListening || isAiSpeaking)
                                            ? `${bar.baseHeight * (0.8 + audioLevel * 2.5)}px`
                                            : `${bar.baseHeight * 0.4}px`,
                                        opacity: (isListening || isAiSpeaking) ? 0.7 + audioLevel * 0.3 : 0.3
                                    }}
                                    transition={{
                                        duration: 0.1,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Main Action Button */}
                        <motion.button
                            onClick={isListening ? stopListening : startListening}
                            disabled={!isConnected || isAiSpeaking}
                            className={cn(
                                "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50",
                                isListening
                                    ? "bg-gradient-to-br from-red-500 to-red-600"
                                    : isAiSpeaking
                                        ? "bg-gradient-to-br from-green-400 to-green-600"
                                        : "bg-gradient-to-br from-[#FFD700] to-[#FFA500]"
                            )}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: isConnected && !isAiSpeaking ? 1.05 : 1 }}
                        >
                            {/* Glow ring */}
                            <motion.div
                                className={cn(
                                    "absolute inset-0 rounded-full",
                                    isListening ? "bg-red-500/20" : isAiSpeaking ? "bg-green-500/20" : "bg-[#FFD700]/20"
                                )}
                                animate={(isListening || isAiSpeaking) ? {
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 0, 0.5]
                                } : {}}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            />

                            {connectionState === 'connecting' || connectionState === 'connected' ? (
                                <Loader2 className="w-9 h-9 text-black relative z-10 animate-spin" />
                            ) : isListening ? (
                                <MicOff className="w-9 h-9 text-white relative z-10" />
                            ) : isAiSpeaking ? (
                                <Volume2 className="w-9 h-9 text-white relative z-10" />
                            ) : (
                                <Mic className="w-9 h-9 text-black relative z-10" />
                            )}
                        </motion.button>

                        {/* Status Text */}
                        <p className="mt-6 text-sm text-gray-400">
                            {!isConnected && 'Menghubungkan ke AI...'}
                            {isConnected && !isListening && !isAiSpeaking && 'Tap untuk mulai bicara'}
                            {isListening && 'Mendengarkan... Tap untuk berhenti'}
                            {isAiSpeaking && 'AI sedang menjawab...'}
                        </p>

                        {/* AI Response Display */}
                        <div className="w-full min-h-[60px] mt-6 px-4">
                            <AnimatePresence mode="wait">
                                {aiResponse ? (
                                    <motion.div
                                        key="response"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-center"
                                    >
                                        <p className="text-white text-base leading-relaxed">
                                            {aiResponse}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-gray-600 text-sm"
                                    >
                                        {isListening ? 'Mendengarkan...' : 'Respons AI akan muncul di sini'}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="px-6 py-4 border-t border-white/5 bg-black/20">
                        <div className="flex items-center justify-center gap-2">
                            <motion.div
                                className={cn(
                                    "w-2 h-2 rounded-full",
                                    connectionState === 'ready'
                                        ? isAiSpeaking ? "bg-green-500" : "bg-green-500"
                                        : connectionState === 'connecting' || connectionState === 'connected'
                                            ? "bg-yellow-500"
                                            : "bg-gray-600"
                                )}
                                animate={(connectionState === 'ready' || isListening) ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <span className="text-xs text-gray-500">
                                {connectionState === 'ready' ? 'Terhubung ke Gemini Live' : 'Menghubungkan...'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});
