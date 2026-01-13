/**
 * useLiveApi Hook
 * React hook for Live API real-time communication with Gemini
 * Supports audio streaming, transcription, and session management
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { LiveApiClient, createLiveApiClient } from '@/lib/live';
import { AudioPlayer } from '@/utils/audioPlayer';
import {
    LiveApiConnectionState,
    LiveApiVoice,
    ToolCallPayload,
    UsageMetadataPayload,
    AUDIO_INPUT_CONFIG,
    ThinkingConfig,
    RealtimeInputConfig,
} from '@/lib/live-api.types';

export interface UseLiveApiOptions {
    model?: string;
    voice?: LiveApiVoice;
    systemInstruction?: string;
    enableTranscription?: boolean;
    thinkingConfig?: ThinkingConfig;
    realtimeInputConfig?: RealtimeInputConfig;
    onTextResponse?: (text: string) => void;
    onInputTranscription?: (text: string) => void;
    onOutputTranscription?: (text: string) => void;
    onToolCall?: (calls: ToolCallPayload['functionCalls']) => void;
    onInterrupted?: () => void;
    onGoAway?: (timeLeft: string) => void;
    onError?: (error: { code: string; message: string }) => void;
}

export interface UseLiveApiReturn {
    // State
    connectionState: LiveApiConnectionState;
    isRecording: boolean;
    isPlaying: boolean;
    transcript: string;
    inputTranscript: string;
    outputTranscript: string;

    // Actions
    connect: () => Promise<void>;
    disconnect: () => void;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    sendMessage: (text: string) => void;
    sendToolResponse: (id: string, name: string, response: Record<string, unknown>) => void;
    sendAudioStreamEnd: () => void;

    // Voice options
    setVoice: (voice: LiveApiVoice) => void;
    currentVoice: LiveApiVoice;
}

export function useLiveApi(options: UseLiveApiOptions = {}): UseLiveApiReturn {
    const [connectionState, setConnectionState] = useState<LiveApiConnectionState>('disconnected');
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [inputTranscript, setInputTranscript] = useState('');
    const [outputTranscript, setOutputTranscript] = useState('');
    const [currentVoice, setCurrentVoice] = useState<LiveApiVoice>(options.voice || 'Kore');

    const clientRef = useRef<LiveApiClient | null>(null);
    const audioPlayerRef = useRef<AudioPlayer | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize audio player
    useEffect(() => {
        audioPlayerRef.current = new AudioPlayer({
            onPlayStart: () => setIsPlaying(true),
            onPlayEnd: () => setIsPlaying(false),
        });

        return () => {
            audioPlayerRef.current?.dispose();
            audioPlayerRef.current = null;
        };
    }, []);

    /**
     * Connect to Live API
     */
    const connect = useCallback(async () => {
        if (clientRef.current) {
            console.warn('[useLiveApi] Already connected');
            return;
        }

        try {
            // Initialize audio player first (requires user interaction)
            await audioPlayerRef.current?.init();

            clientRef.current = createLiveApiClient({
                model: options.model || 'gemini-2.5-flash-native-audio-preview-12-2025',
                voice: currentVoice,
                systemInstruction: options.systemInstruction,
                onConnect: () => setConnectionState('connected'),
                onSetupComplete: () => setConnectionState('ready'),
                onAudioResponse: (data) => {
                    audioPlayerRef.current?.queueAudio(data);
                },
                onTextResponse: (text) => {
                    setTranscript((prev) => prev + text);
                    options.onTextResponse?.(text);
                },
                onInputTranscription: (text) => {
                    setInputTranscript(text);
                    options.onInputTranscription?.(text);
                },
                onOutputTranscription: (text) => {
                    setOutputTranscript((prev) => prev + text);
                    options.onOutputTranscription?.(text);
                },
                onToolCall: options.onToolCall,
                onInterrupted: () => {
                    // Stop audio playback when interrupted
                    audioPlayerRef.current?.stop();
                    options.onInterrupted?.();
                },
                onGoAway: options.onGoAway,
                onTurnComplete: () => {
                    // AI finished speaking
                },
                onGenerationComplete: () => {
                    // Generation complete
                },
                onError: (error) => {
                    setConnectionState('error');
                    options.onError?.(error);
                },
                onDisconnect: () => {
                    setConnectionState('disconnected');
                    clientRef.current = null;
                },
            });

            setConnectionState('connecting');
            await clientRef.current.connect();

            // Setup session after connection with transcription enabled
            clientRef.current.setupSession({
                inputAudioTranscription: options.enableTranscription !== false ? {} : undefined,
                outputAudioTranscription: options.enableTranscription !== false ? {} : undefined,
                thinkingConfig: options.thinkingConfig,
                realtimeInputConfig: options.realtimeInputConfig,
            });
        } catch (error) {
            console.error('[useLiveApi] Connection failed:', error);
            setConnectionState('error');
            options.onError?.({
                code: 'CONNECTION_ERROR',
                message: error instanceof Error ? error.message : 'Failed to connect',
            });
        }
    }, [currentVoice, options]);

    /**
     * Disconnect from Live API
     */
    const disconnect = useCallback(() => {
        stopRecordingInternal();
        clientRef.current?.disconnect();
        clientRef.current = null;
        setConnectionState('disconnected');
        setTranscript('');
        setInputTranscript('');
        setOutputTranscript('');
    }, []);

    /**
     * Internal stop recording
     */
    const stopRecordingInternal = useCallback(() => {
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

        setIsRecording(false);
    }, []);

    /**
     * Start recording audio from microphone
     */
    const startRecording = useCallback(async () => {
        if (!clientRef.current?.isReady()) {
            console.warn('[useLiveApi] Not ready to record');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: AUDIO_INPUT_CONFIG.sampleRate,
                    channelCount: AUDIO_INPUT_CONFIG.channels,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            streamRef.current = stream;

            // Create audio context for processing
            audioContextRef.current = new AudioContext({
                sampleRate: AUDIO_INPUT_CONFIG.sampleRate,
            });

            const source = audioContextRef.current.createMediaStreamSource(stream);

            // Create script processor for raw PCM access
            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

            processorRef.current.onaudioprocess = (event) => {
                if (!isRecording || !clientRef.current?.isReady()) return;

                const inputBuffer = event.inputBuffer.getChannelData(0);

                // Convert Float32 to Int16
                const int16Array = new Int16Array(inputBuffer.length);
                for (let i = 0; i < inputBuffer.length; i++) {
                    const s = Math.max(-1, Math.min(1, inputBuffer[i]));
                    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }

                // Convert to base64
                const bytes = new Uint8Array(int16Array.buffer);
                let binary = '';
                bytes.forEach((b) => (binary += String.fromCharCode(b)));
                const base64 = btoa(binary);

                // Send to server
                clientRef.current?.sendRealtimeInput({
                    audio: {
                        data: base64,
                        mimeType: AUDIO_INPUT_CONFIG.mimeType,
                    },
                });
            };

            source.connect(processorRef.current);
            processorRef.current.connect(audioContextRef.current.destination);

            setIsRecording(true);
            setTranscript('');
            setInputTranscript('');
            setOutputTranscript('');
        } catch (error) {
            console.error('[useLiveApi] Failed to start recording:', error);
            options.onError?.({
                code: 'RECORDING_ERROR',
                message: error instanceof Error ? error.message : 'Failed to access microphone',
            });
        }
    }, [isRecording, options]);

    /**
     * Stop recording
     */
    const stopRecording = useCallback(() => {
        // Send audio stream end to flush any cached audio
        clientRef.current?.sendAudioStreamEnd();
        stopRecordingInternal();
    }, [stopRecordingInternal]);

    /**
     * Send audio stream end signal
     */
    const sendAudioStreamEnd = useCallback(() => {
        clientRef.current?.sendAudioStreamEnd();
    }, []);

    /**
     * Send text message
     */
    const sendMessage = useCallback((text: string) => {
        if (!clientRef.current?.isReady()) {
            console.warn('[useLiveApi] Not ready to send');
            return;
        }

        clientRef.current.sendTextMessage(text);
        setTranscript('');
        setOutputTranscript('');
    }, []);

    /**
     * Send tool response
     */
    const sendToolResponse = useCallback(
        (id: string, name: string, response: Record<string, unknown>) => {
            if (!clientRef.current?.isReady()) {
                console.warn('[useLiveApi] Not ready to send tool response');
                return;
            }

            clientRef.current.sendToolResponse([
                {
                    functionResponse: {
                        name,
                        response,
                    },
                } as any,
            ]);
        },
        []
    );

    /**
     * Set voice
     */
    const setVoice = useCallback((voice: LiveApiVoice) => {
        setCurrentVoice(voice);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
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
        sendToolResponse,
        sendAudioStreamEnd,
        setVoice,
        currentVoice,
    };
}

export default useLiveApi;
