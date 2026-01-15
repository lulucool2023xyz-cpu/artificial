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
    ChevronDown,
    AlertCircle,
    MessageSquare,
    Radio,
    Waves,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveApi } from '@/hooks/useLiveApi';
import { LIVE_API_VOICES, LiveApiVoice } from '@/lib/live-api.types';
import { toast } from 'sonner';

interface LiveChatProps {
    className?: string;
}

export const LiveChat = memo(function LiveChat({ className }: LiveChatProps) {
    const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [isMuted, setIsMuted] = useState(false);

    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const addDebugLog = useCallback((msg: string) => {
        setDebugLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
        console.log(`[LiveChat Debug] ${msg}`);
    }, []);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        connectionState,
        isRecording,
        isPlaying,
        transcript,
        inputTranscript,
        outputTranscript,
        connect,
        disconnect,
        startRecording,
        stopRecording,
        sendMessage,
        setVoice,
        currentVoice,
    } = useLiveApi({
        systemInstruction: 'You are a helpful assistant. Respond naturally and conversationally in the same language as the user. Keep responses concise but helpful.',
        onConnect: () => addDebugLog('Connected callback fired'),
        onDisconnect: (reason) => addDebugLog(`Disconnected: ${reason}`),
        onTextResponse: (text) => {
            // Accumulate assistant response
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                    return [...prev.slice(0, -1), { role: 'assistant', content: last.content + text }];
                }
                return [...prev, { role: 'assistant', content: text }];
            });
        },
        onInputTranscription: (text) => {
            addDebugLog(`User input: ${text.substring(0, 20)}...`);
        },
        onOutputTranscription: (text) => {
            addDebugLog(`AI output: ${text.substring(0, 20)}...`);
        },
        onError: (err) => {
            addDebugLog(`Error: ${err.message}`);
            toast.error('Live Chat Error', { description: err.message });
        },
        onInterrupted: () => {
            addDebugLog('Interrupted');
        },
        onGoAway: (timeLeft) => {
            addDebugLog(`GoAway: ${timeLeft}`);
            toast.warning('Session ending soon', { description: `Time remaining: ${timeLeft}` });
        },
    });

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, transcript, inputTranscript, outputTranscript]);

    const handleConnect = useCallback(async () => {
        try {
            console.log('[LiveChat] Connecting...');
            await connect();
            toast.success('Connected to Live Chat');
        } catch (error) {
            console.error('[LiveChat] Connection failed:', error);
            toast.error('Failed to connect', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }, [connect]);

    const handleDisconnect = useCallback(() => {
        disconnect();
        setMessages([]);
        toast.info('Disconnected');
    }, [disconnect]);

    const handleToggleRecording = useCallback(async () => {
        if (isRecording) {
            stopRecording();
            // Add user's transcribed speech to messages
            if (inputTranscript.trim()) {
                setMessages(prev => [...prev, { role: 'user', content: inputTranscript }]);
            }
        } else {
            await startRecording();
        }
    }, [isRecording, startRecording, stopRecording, inputTranscript]);

    const handleSendText = useCallback(() => {
        if (!textInput.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: textInput }]);
        sendMessage(textInput);
        setTextInput('');
    }, [textInput, sendMessage]);

    const currentVoiceData = LIVE_API_VOICES.find(v => v.id === currentVoice) || LIVE_API_VOICES[0];

    const isConnected = connectionState === 'connected' || connectionState === 'ready' || connectionState === 'setup_pending';
    const isReady = connectionState === 'ready';

    // Connection state indicator color
    const getStateColor = () => {
        switch (connectionState) {
            case 'ready': return 'bg-green-500';
            case 'connected':
            case 'setup_pending': return 'bg-yellow-500';
            case 'connecting': return 'bg-blue-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                            isReady
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
                                    getStateColor(),
                                    isReady && "animate-pulse"
                                )} />
                                <p className="text-sm text-muted-foreground capitalize">
                                    {connectionState.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Connect/Disconnect Button */}
                    <button
                        onClick={isConnected ? handleDisconnect : handleConnect}
                        disabled={connectionState === 'connecting'}
                        className={cn(
                            "p-3 rounded-xl transition-all flex items-center gap-2",
                            isConnected
                                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                : connectionState === 'connecting'
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                        )}
                    >
                        {connectionState === 'connecting' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isConnected ? (
                            <PhoneOff className="w-5 h-5" />
                        ) : (
                            <Phone className="w-5 h-5" />
                        )}
                        <span className="hidden sm:inline text-sm font-medium">
                            {isConnected ? 'Disconnect' : connectionState === 'connecting' ? 'Connecting...' : 'Connect'}
                        </span>
                    </button>
                </div>

                {/* Voice Selection */}
                <div className="relative">
                    <button
                        onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                        disabled={isConnected}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary border border-border transition-colors",
                            isConnected ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary/80"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Volume2 className="w-4 h-4 text-primary" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-foreground">{currentVoiceData.name}</p>
                                <p className="text-xs text-muted-foreground">{currentVoiceData.description}</p>
                            </div>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showVoiceDropdown && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {showVoiceDropdown && !isConnected && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-20 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="max-h-64 overflow-y-auto p-2">
                                    {LIVE_API_VOICES.map((voice) => (
                                        <button
                                            key={voice.id}
                                            onClick={() => {
                                                setVoice(voice.id as LiveApiVoice);
                                                setShowVoiceDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left",
                                                currentVoice === voice.id
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-secondary text-foreground"
                                            )}
                                        >
                                            <Volume2 className="w-4 h-4" />
                                            <div>
                                                <p className="text-sm font-medium">{voice.name}</p>
                                                <p className="text-xs text-muted-foreground">{voice.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 && !transcript && !inputTranscript && !outputTranscript && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            {isReady ? 'Ready to Chat' : 'Connect to Start'}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {isReady
                                ? 'Press the microphone button and speak, or type a message below'
                                : 'Click Connect to start a real-time voice conversation'
                            }
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "max-w-[85%] p-4 rounded-2xl",
                            msg.role === 'user'
                                ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-secondary text-foreground rounded-bl-sm"
                        )}
                    >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </motion.div>
                ))}

                {/* Live input transcription (what user is saying) */}
                {inputTranscript && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-[85%] ml-auto p-4 rounded-2xl rounded-br-sm bg-primary/50 text-primary-foreground"
                    >
                        <p className="text-sm whitespace-pre-wrap">{inputTranscript}</p>
                        <span className="inline-block w-2 h-4 bg-primary-foreground animate-pulse ml-1" />
                    </motion.div>
                )}

                {/* Live output transcription (what AI is saying) */}
                {outputTranscript && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-[85%] p-4 rounded-2xl rounded-bl-sm bg-secondary/80 text-foreground"
                    >
                        <p className="text-sm whitespace-pre-wrap">{outputTranscript}</p>
                        {isPlaying && <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1" />}
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Only show when ready */}
            {isReady && (
                <div className="p-4 sm:p-6 border-t border-border">
                    {/* Recording indicator */}
                    <AnimatePresence>
                        {isRecording && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center justify-center gap-3 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
                            >
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-sm text-red-500 font-medium">Listening... (16kHz PCM)</span>
                                <Waves className="w-5 h-5 text-red-500 animate-pulse" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Playing indicator */}
                    <AnimatePresence>
                        {isPlaying && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center justify-center gap-3 mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30"
                            >
                                <Volume2 className="w-5 h-5 text-green-500 animate-pulse" />
                                <span className="text-sm text-green-500 font-medium">AI Speaking... (24kHz PCM)</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3">
                        {/* Mute Button */}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={cn(
                                "p-3 rounded-xl transition-colors",
                                isMuted
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                            )}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        {/* Text Input */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                                placeholder="Type a message..."
                                className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                onClick={handleSendText}
                                disabled={!textInput.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Mic Button */}
                        <button
                            onClick={handleToggleRecording}
                            className={cn(
                                "p-4 rounded-xl transition-all",
                                isRecording
                                    ? "bg-red-500 text-white animate-pulse"
                                    : "bg-primary text-primary-foreground hover:opacity-90"
                            )}
                            title={isRecording ? "Stop Recording" : "Start Recording"}
                        >
                            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Error state */}
            {connectionState === 'error' && (
                <div className="p-4 sm:p-6 border-t border-border">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-500">Connection error. Please try reconnecting.</p>
                        <button
                            onClick={handleConnect}
                            className="ml-auto px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:opacity-90 flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Debug Logs Overlay */}
            <div className="absolute bottom-4 left-4 z-50">
                <button
                    onClick={() => console.log(debugLogs)}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors mb-1"
                >
                    Debug Logs
                </button>
                <div className="w-64 max-h-40 overflow-y-auto bg-black/80 text-green-400 font-mono text-[10px] p-2 rounded pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
                    {debugLogs.length === 0 && <span className="text-gray-500">No logs yet...</span>}
                    {debugLogs.map((log, i) => (
                        <div key={i} className="whitespace-nowrap">{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default LiveChat;
