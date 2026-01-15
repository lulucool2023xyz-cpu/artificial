/**
 * LiveChat Component
 * Real-time voice chat using Gemini Live API
 */

import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Phone,
    PhoneOff,
    Volume2,
    VolumeX,
    Loader2,
    MessageSquare,
    Radio,
    Waves,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveApi, useAudioPlayer, useMediaStream } from '@/hooks';
import { toast } from 'sonner';

interface LiveChatProps {
    className?: string;
}

export const LiveChat = memo(function LiveChat({ className }: LiveChatProps) {
    const [status, setStatus] = useState('Disconnected');
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [transcript, setTranscript] = useState(''); // Current accumulating transcript
    const [isMuted, setIsMuted] = useState(false);

    // Track if user explicitly started the session
    const [hasUserStarted, setHasUserStarted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { queueAudio, stopPlayback, isPlaying, clearQueue } = useAudioPlayer();

    // Setup media stream for visual feedback (video optional)
    const {
        videoRef,
        errorMessage: mediaError,
        startCapture,
        stopCapture,
        startAudioCapture,
        stopAudioCapture
    } = useMediaStream({ video: false, audio: true }) as any; // Cast as any because hook return type might need adjustment or useMediaStream signature changed in my previous step

    const handleAudioResponse = useCallback((audioData: string, mimeType: string) => {
        queueAudio(audioData, mimeType);
    }, [queueAudio]);

    const handleInputTranscription = useCallback((text: string) => {
        setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'user') {
                // Update last user message
                return [...prev.slice(0, -1), { role: 'user', content: text }];
            }
            return [...prev, { role: 'user', content: text }];
        });
    }, []);

    const handleOutputTranscription = useCallback((text: string) => {
        setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
                return [...prev.slice(0, -1), { role: 'assistant', content: text }];
            }
            return [...prev, { role: 'assistant', content: text }];
        });
    }, []);

    const handleTurnComplete = useCallback(() => {
        // Optional: finalize message state
    }, []);

    const handleInterrupted = useCallback(() => {
        stopPlayback();
        clearQueue();
        toast.info('Interrupted');
    }, [stopPlayback, clearQueue]);

    const handleError = useCallback((error: string) => {
        setStatus(`Error: ${error}`);
        toast.error('Live API Error', { description: error });
    }, []);

    const handleSessionStarted = useCallback(() => {
        setStatus('Session Active');
        toast.success('Ready to talk!');
    }, []);

    const {
        connectionState,
        isConnected, // boolean
        isSessionActive,
        connect,
        disconnect,
        startSession,
        endSession,
        sendAudio,
    } = useLiveApi({
        onAudioResponse: handleAudioResponse,
        onInputTranscription: handleInputTranscription,
        onOutputTranscription: handleOutputTranscription,
        onTurnComplete: handleTurnComplete,
        onInterrupted: handleInterrupted,
        onError: handleError,
        onSessionStarted: handleSessionStarted,
    }) as any; // Cast for compatibility if types mismatch

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle Connection & Session Flow
    const handleToggleConnection = useCallback(() => {
        if (isConnected) {
            // Disconnect
            stopPlayback();
            stopAudioCapture();
            stopCapture();
            disconnect();
            setHasUserStarted(false);
            setStatus('Disconnected');
        } else {
            // Connect
            connect();
            setHasUserStarted(true);
            setStatus('Connecting...');
        }
    }, [isConnected, stopPlayback, stopAudioCapture, stopCapture, disconnect, connect]);

    // Once connected, start session and audio capture
    useEffect(() => {
        if (isConnected && hasUserStarted && !isSessionActive) {
            startSession({
                systemInstruction: 'You are a helpful assistant. Respond naturally and conversationally in the same language as the user. Keep responses concise but helpful.'
            });

            // Start Capture
            startCapture().then(() => {
                startAudioCapture((base64: string) => {
                    sendAudio(base64);
                });
            });
        }
    }, [isConnected, hasUserStarted, isSessionActive, startSession, startCapture, startAudioCapture, sendAudio]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopPlayback();
            stopAudioCapture();
            stopCapture();
        };
    }, []);

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                            isSessionActive
                                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                : "bg-gradient-to-br from-gray-500 to-gray-600"
                        )}>
                            <Radio className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Live Voice Chat</h2>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    isSessionActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                                )} />
                                <p className="text-sm text-muted-foreground">
                                    {status}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleConnection}
                        className={cn(
                            "p-3 rounded-xl transition-all flex items-center gap-2",
                            isConnected
                                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                        )}
                    >
                        {isConnected ? (
                            <>
                                <PhoneOff className="w-5 h-5" />
                                <span className="hidden sm:inline">Disconnect</span>
                            </>
                        ) : (
                            <>
                                <Phone className="w-5 h-5" />
                                <span className="hidden sm:inline">Connect</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                        <p>Start the conversation to see messages here</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "max-w-[85%] p-4 rounded-2xl",
                            msg.role === 'user'
                                ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-secondary text-foreground rounded-bl-sm"
                        )}
                    >
                        <p className="text-sm">{msg.content}</p>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            {isSessionActive && (
                <div className="p-4 border-t border-border bg-card/50">
                    <div className="flex items-center justify-center gap-4">
                        <div className={cn(
                            "px-4 py-2 rounded-full flex items-center gap-2",
                            isPlaying ? "bg-green-500/20 text-green-500" : "bg-secondary text-muted-foreground"
                        )}>
                            <Volume2 className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
                            <span className="text-xs font-medium">{isPlaying ? "AI Speaking" : "Idle"}</span>
                        </div>

                        <div className={cn(
                            "px-4 py-2 rounded-full flex items-center gap-2",
                            "bg-red-500/20 text-red-500"
                        )}>
                            <Waves className="w-4 h-4 animate-pulse" />
                            <span className="text-xs font-medium">Mic Active</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
