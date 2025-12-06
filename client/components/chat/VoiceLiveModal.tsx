import { memo, useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedBubbleParticles } from '@/components/ui/AnimatedBubbleParticles';

interface VoiceLiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const VoiceLiveModal = memo(function VoiceLiveModal({
    isOpen,
    onClose
}: VoiceLiveModalProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioLevel, setAudioLevel] = useState(0);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Generate random wave bars
    const waveBarCount = 40;
    const generateWaveBars = () => {
        return Array.from({ length: waveBarCount }, (_, i) => ({
            delay: i * 0.02,
            baseHeight: 20 + Math.random() * 30
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
            setIsListening(false);
            setTranscript('');
        }
    }, [isOpen]);

    const startListening = async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Setup audio analysis for visualization
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;

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
        setIsListening(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg mx-4 h-[500px] sm:h-[550px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Animated Background Particles */}
                <div className="absolute inset-0">
                    <AnimatedBubbleParticles
                        particleColor="#FFD700"
                        particleSize={25}
                        spawnInterval={150}
                        enableGooEffect={true}
                        blurStrength={12}
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center">
                                <Volume2 className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white">Voice Chat Live</h2>
                                <p className="text-xs text-gray-400">Bicara dengan AI secara realtime</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Voice Visualization Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        {/* Audio Wave Visualization */}
                        <div className="flex items-center justify-center gap-[2px] h-32 mb-6">
                            {waveBars.map((bar, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-1 rounded-full transition-all duration-100",
                                        isListening
                                            ? "bg-gradient-to-t from-[#FFD700] to-[#FFA500]"
                                            : "bg-white/20"
                                    )}
                                    style={{
                                        height: isListening
                                            ? `${bar.baseHeight * (0.5 + audioLevel * 1.5)}px`
                                            : `${bar.baseHeight * 0.3}px`,
                                        animationDelay: `${bar.delay}s`,
                                        animation: isListening
                                            ? `voiceWaveModal 0.4s ease-in-out ${bar.delay}s infinite alternate`
                                            : 'none',
                                        transform: `scaleY(${isListening ? 1 + audioLevel : 0.5})`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Transcript Display */}
                        <div className="w-full max-h-24 overflow-y-auto mb-6">
                            {transcript ? (
                                <p className="text-center text-white text-lg font-medium animate-fade-in">
                                    "{transcript}"
                                </p>
                            ) : (
                                <p className="text-center text-gray-400 text-sm">
                                    {isListening ? 'Mendengarkan...' : 'Tekan untuk mulai berbicara'}
                                </p>
                            )}
                        </div>

                        {/* Main Action Button */}
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                                isListening
                                    ? "bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse"
                                    : "bg-[#FFD700] hover:bg-[#FFD700]/90 shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                            )}
                        >
                            {isListening ? (
                                <MicOff className="w-8 h-8 text-white" />
                            ) : (
                                <Mic className="w-8 h-8 text-black" />
                            )}
                        </button>

                        <p className="mt-4 text-sm text-gray-400">
                            {isListening ? 'Klik untuk berhenti' : 'Klik untuk mulai'}
                        </p>
                    </div>

                    {/* Status Bar */}
                    <div className="p-4 border-t border-white/10 bg-black/30">
                        <div className="flex items-center justify-center gap-3">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                isListening ? "bg-green-500 animate-pulse" : "bg-gray-500"
                            )} />
                            <span className="text-sm text-gray-300">
                                {isListening ? 'Aktif - Merekam suara...' : 'Tidak aktif'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CSS for wave animation */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes voiceWaveModal {
            0% { transform: scaleY(0.5); }
            100% { transform: scaleY(1.2); }
          }
        `}} />
            </div>
        </div>
    );
});
