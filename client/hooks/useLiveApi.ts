/**
 * useLiveApi Hook
 * React hook for Live API real-time communication
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { LiveApiClient, createLiveApiClient } from '@/lib/live';
import { AudioPlayer } from '@/utils/audioPlayer';
import {
    LiveApiConnectionState,
    LiveApiVoice,
    ToolCallPayload,
    AUDIO_INPUT_CONFIG,
} from '@/lib/live-api.types';

export interface UseLiveApiOptions {
    model?: string;
    voice?: LiveApiVoice;
    systemInstruction?: string;
    onTextResponse?: (text: string) => void;
    onToolCall?: (calls: ToolCallPayload['functionCalls']) => void;
    onError?: (error: { code: string; message: string }) => void;
}

export interface UseLiveApiReturn {
    // State
    connectionState: LiveApiConnectionState;
    isRecording: boolean;
    isPlaying: boolean;
    transcript: string;

    // Actions
    connect: () => Promise<void>;
    disconnect: () => void;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    sendMessage: (text: string) => void;
    sendToolResponse: (name: string, response: Record<string, unknown>) => void;

    // Voice options
    setVoice: (voice: LiveApiVoice) => void;
    currentVoice: LiveApiVoice;
}

export function useLiveApi(options: UseLiveApiOptions = {}): UseLiveApiReturn {
    const [connectionState, setConnectionState] = useState<LiveApiConnectionState>('disconnected');
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [currentVoice, setCurrentVoice] = useState<LiveApiVoice>(options.voice || 'Kore');

    const clientRef = useRef<LiveApiClient | null>(null);
    const audioPlayerRef = useRef<AudioPlayer | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

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
                model: options.model || 'gemini-2.5-flash-native-audio-preview',
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
                onToolCall: options.onToolCall,
                onTurnComplete: () => {
                    // Clear transcript after response complete
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

            // Setup session after connection
            clientRef.current.setupSession();
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
        stopRecording();
        clientRef.current?.disconnect();
        clientRef.current = null;
        setConnectionState('disconnected');
        setTranscript('');
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
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setIsRecording(false);
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
    }, []);

    /**
     * Send tool response
     */
    const sendToolResponse = useCallback(
        (name: string, response: Record<string, unknown>) => {
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
                },
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
        connect,
        disconnect,
        startRecording,
        stopRecording,
        sendMessage,
        sendToolResponse,
        setVoice,
        currentVoice,
    };
}

export default useLiveApi;
