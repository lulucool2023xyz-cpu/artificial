import { memo, useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VoiceLiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const VoiceLiveModal = memo(function VoiceLiveModal({
    isOpen,
    onClose
}: VoiceLiveModalProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioLevel, setAudioLevel] = useState(0);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Generate elegant wave bars - fewer, more refined
    const waveBarCount = 24;
    const generateWaveBars = () => {
        return Array.from({ length: waveBarCount }, (_, i) => ({
            delay: i * 0.03,
            baseHeight: 8 + Math.random() * 16
        }));
    };
    const [waveBars] = useState(generateWaveBars);

    useEffect(() => {
        if (!isOpen) {
            // Cleanup when modal closes
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setIsListening(false);
            setTranscript('');
            setAudioLevel(0);
        }
    }, [isOpen]);

    const startListening = async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Setup audio analysis for visualization
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 128;

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

            // Setup speech recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'id-ID';

                recognitionRef.current.onresult = (event: any) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const result = event.results[i];
                        if (result.isFinal) {
                            finalTranscript += result[0].transcript;
                        } else {
                            interimTranscript += result[0].transcript;
                        }
                    }

                    setTranscript(finalTranscript || interimTranscript);
                };

                recognitionRef.current.start();
                setIsListening(true);
            }
        } catch (error) {
            console.error('Error starting voice input:', error);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsListening(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop - elegant blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal Container - Clean, minimal design */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md rounded-3xl overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#111111] border border-white/10 shadow-2xl"
            >
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/3" />
                
                {/* Elegant ring glow when listening */}
                {isListening && (
                    <motion.div
                        className="absolute inset-0 rounded-3xl"
                        animate={{
                            boxShadow: [
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
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
                                <Volume2 className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white text-lg">Voice Chat</h2>
                                <p className="text-xs text-gray-500">AI Assistant</p>
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
                        {/* Elegant Waveform */}
                        <div className="flex items-center justify-center gap-1 h-20 mb-8">
                            {waveBars.map((bar, i) => (
                                <motion.div
                                    key={i}
                                    className={cn(
                                        "w-1 rounded-full transition-colors duration-300",
                                        isListening
                                            ? "bg-gradient-to-t from-[#FFD700]/80 to-[#FFD700]"
                                            : "bg-white/10"
                                    )}
                                    animate={{
                                        height: isListening
                                            ? `${bar.baseHeight * (0.8 + audioLevel * 2.5)}px`
                                            : `${bar.baseHeight * 0.4}px`,
                                        opacity: isListening ? 0.7 + audioLevel * 0.3 : 0.3
                                    }}
                                    transition={{
                                        duration: 0.1,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Main Action Button - Refined design */}
                        <motion.button
                            onClick={isListening ? stopListening : startListening}
                            className={cn(
                                "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                                isListening
                                    ? "bg-gradient-to-br from-red-500 to-red-600"
                                    : "bg-gradient-to-br from-[#FFD700] to-[#FFA500]"
                            )}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Subtle glow ring */}
                            <motion.div
                                className={cn(
                                    "absolute inset-0 rounded-full",
                                    isListening ? "bg-red-500/20" : "bg-[#FFD700]/20"
                                )}
                                animate={isListening ? {
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 0, 0.5]
                                } : {}}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            />
                            {isListening ? (
                                <MicOff className="w-9 h-9 text-white relative z-10" />
                            ) : (
                                <Mic className="w-9 h-9 text-black relative z-10" />
                            )}
                        </motion.button>

                        {/* Status Text */}
                        <p className="mt-6 text-sm text-gray-400">
                            {isListening ? 'Tap untuk berhenti' : 'Tap untuk mulai'}
                        </p>

                        {/* Transcript Display */}
                        <div className="w-full min-h-[60px] mt-6 px-4">
                            {transcript ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center"
                                >
                                    <p className="text-white text-base leading-relaxed">
                                        "{transcript}"
                                    </p>
                                </motion.div>
                            ) : (
                                <p className="text-center text-gray-600 text-sm">
                                    {isListening ? 'Mendengarkan...' : 'Transkripsi akan muncul di sini'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status Bar - Minimal */}
                    <div className="px-6 py-4 border-t border-white/5 bg-black/20">
                        <div className="flex items-center justify-center gap-2">
                            <motion.div
                                className={cn(
                                    "w-2 h-2 rounded-full",
                                    isListening ? "bg-green-500" : "bg-gray-600"
                                )}
                                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <span className="text-xs text-gray-500">
                                {isListening ? 'Merekam' : 'Siap'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});
