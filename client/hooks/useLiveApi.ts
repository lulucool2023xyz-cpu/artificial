/**
 * useLiveApi Hook
 * React hook for Live API real-time communication with Gemini
 * 
 * Audio Format Requirements (per Gemini Live API docs):
 * - Input: 16-bit PCM, 16kHz, mono
 * - Output: 16-bit PCM, 24kHz, mono
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
    onConnect?: () => void;
    onDisconnect?: (reason?: string) => void;
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
    startRecording: (stream?: MediaStream) => Promise<void>;
    stopRecording: () => void;
    sendMessage: (text: string) => void;
    sendVideoFrame: (data: string, mimeType?: string) => void;
    sendToolResponse: (id: string, name: string, response: Record<string, unknown>) => void;
    sendAudioStreamEnd: () => void;
    resumeAudio: () => Promise<void>;

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
    const isExternalStreamRef = useRef(false);
    const isRecordingRef = useRef(false); // Ref to track recording state for audio processing

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
            console.warn('[useLiveApi] Already connected or connecting');
            return;
        }

        console.log('[useLiveApi] Connecting...');

        try {
            // Initialize audio player (requires user interaction for iOS/Safari)
            await audioPlayerRef.current?.init();
            console.log('[useLiveApi] Audio player initialized');

            // Create Live API client
            clientRef.current = createLiveApiClient({
                model: options.model || 'gemini-2.5-flash-native-audio-preview-12-2025',
                voice: currentVoice,
                systemInstruction: options.systemInstruction,

                onConnect: () => {
                    console.log('[useLiveApi] Connected to gateway');
                    setConnectionState('connected');
                    options.onConnect?.();
                },

                onSetupComplete: () => {
                    console.log('[useLiveApi] ✅ Ready for audio/text input');
                    setConnectionState('ready');
                },

                onAudioResponse: (data) => {
                    // Queue audio for playback (24kHz PCM from Gemini)
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
                    // Stop playback immediately when user interrupts
                    audioPlayerRef.current?.stop();
                    options.onInterrupted?.();
                },

                onGoAway: options.onGoAway,

                onTurnComplete: () => {
                    // AI finished its turn
                    console.log('[useLiveApi] Turn complete');
                },

                onGenerationComplete: () => {
                    console.log('[useLiveApi] Generation complete');
                },

                onError: (error) => {
                    console.error('[useLiveApi] Error:', error);
                    setConnectionState('error');
                    options.onError?.(error);
                },

                onDisconnect: (reason) => {
                    console.log('[useLiveApi] Disconnected', reason);
                    setConnectionState('disconnected');
                    clientRef.current = null;
                    options.onDisconnect?.(reason);
                },
            });

            setConnectionState('connecting');

            // Connect to backend gateway
            await clientRef.current.connect();

            // Setup session with Gemini
            clientRef.current.setupSession({
                inputAudioTranscription: options.enableTranscription !== false ? {} : undefined,
                outputAudioTranscription: options.enableTranscription !== false ? {} : undefined,
                thinkingConfig: options.thinkingConfig,
                realtimeInputConfig: options.realtimeInputConfig,
            });

        } catch (error) {
            console.error('[useLiveApi] Connection failed:', error);
            setConnectionState('error');
            clientRef.current = null;
            options.onError?.({
                code: 'CONNECTION_ERROR',
                message: error instanceof Error ? error.message : 'Failed to connect',
            });
        }
    }, [currentVoice, options]);

    /**
     * Stop recording - internal implementation
     */
    const stopRecordingInternal = useCallback(() => {
        console.log('[useLiveApi] Stopping recording...');
        isRecordingRef.current = false;

        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        if (streamRef.current) {
            if (!isExternalStreamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            streamRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setIsRecording(false);
    }, []);

    /**
     * Disconnect from Live API
     */
    const disconnect = useCallback(() => {
        console.log('[useLiveApi] Disconnecting...');
        stopRecordingInternal();
        clientRef.current?.disconnect();
        clientRef.current = null;
        setConnectionState('disconnected');
        setTranscript('');
        setInputTranscript('');
        setOutputTranscript('');
    }, [stopRecordingInternal]);

    /**
     * Start recording audio from microphone
     * 
     * Captures audio at 16kHz, converts to 16-bit PCM, base64 encodes, and streams to Gemini
     */
    const startRecording = useCallback(async (existingStream?: MediaStream) => {
        if (!clientRef.current?.isReady()) {
            console.warn('[useLiveApi] Cannot record - not ready');
            return;
        }

        console.log('[useLiveApi] Starting recording...', existingStream ? '(external stream)' : '(mic request)');

        try {
            let stream = existingStream;

            if (stream) {
                isExternalStreamRef.current = true;
            } else {
                isExternalStreamRef.current = false;
                // Request microphone access with specific constraints
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: AUDIO_INPUT_CONFIG.sampleRate, // 16kHz
                        channelCount: AUDIO_INPUT_CONFIG.channels, // 1 (mono)
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                });
            }

            streamRef.current = stream;
            console.log('[useLiveApi] Microphone access granted');

            // Create audio context at 16kHz (Gemini requirement)
            audioContextRef.current = new AudioContext({
                sampleRate: AUDIO_INPUT_CONFIG.sampleRate,
            });

            const source = audioContextRef.current.createMediaStreamSource(stream);

            // Create script processor for raw PCM access
            // Buffer size 4096 gives ~256ms chunks at 16kHz
            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

            processorRef.current.onaudioprocess = (event) => {
                // Check if still recording and client is ready
                if (!isRecordingRef.current || !clientRef.current?.isReady()) {
                    return;
                }

                const inputBuffer = event.inputBuffer.getChannelData(0);

                // Convert Float32 [-1, 1] to Int16 [-32768, 32767]
                const int16Array = new Int16Array(inputBuffer.length);
                for (let i = 0; i < inputBuffer.length; i++) {
                    const s = Math.max(-1, Math.min(1, inputBuffer[i]));
                    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }

                // Convert to base64
                const bytes = new Uint8Array(int16Array.buffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);

                // Send to Gemini via backend
                clientRef.current?.sendRealtimeInput({
                    audio: {
                        data: base64,
                        mimeType: AUDIO_INPUT_CONFIG.mimeType, // audio/pcm;rate=16000
                    },
                });
            };

            // Connect audio graph
            // ScriptProcessor needs to be connected to destination for onaudioprocess to fire in some browsers
            // But we MUST mute it to prevent local echo/feedback loop
            const silentGain = audioContextRef.current.createGain();
            silentGain.gain.setValueAtTime(0, audioContextRef.current.currentTime);

            // source -> processor -> silentGain -> destination
            source.connect(processorRef.current);
            processorRef.current.connect(silentGain);
            silentGain.connect(audioContextRef.current.destination);

            console.log('[useLiveApi] Audio graph set up: source -> processor -> silentGain(0) -> destination');

            // Update state
            isRecordingRef.current = true;
            setIsRecording(true);
            setTranscript('');
            setInputTranscript('');
            setOutputTranscript('');

            console.log('[useLiveApi] ✅ Recording started (16kHz PCM)');

        } catch (error) {
            console.error('[useLiveApi] Failed to start recording:', error);
            options.onError?.({
                code: 'RECORDING_ERROR',
                message: error instanceof Error ? error.message : 'Failed to access microphone',
            });
        }
    }, [options]);

    /**
     * Stop recording and send audio stream end signal
     */
    const stopRecording = useCallback(() => {
        // Send audio stream end to flush any cached audio in Gemini
        clientRef.current?.sendAudioStreamEnd();
        stopRecordingInternal();
    }, [stopRecordingInternal]);

    /**
     * Send audio stream end signal (for pausing mic without stopping)
     */
    const sendAudioStreamEnd = useCallback(() => {
        clientRef.current?.sendAudioStreamEnd();
    }, []);

    /**
     * Send text message
     */
    const sendMessage = useCallback((text: string) => {
        if (!clientRef.current?.isReady()) {
            console.warn('[useLiveApi] Cannot send message - not ready');
            return;
        }

        console.log('[useLiveApi] Sending text message:', text);
        clientRef.current.sendTextMessage(text);
        setTranscript('');
        setOutputTranscript('');
    }, []);

    /**
     * Send video frame
     */
    const sendVideoFrame = useCallback((data: string, mimeType = 'image/jpeg') => {
        if (!clientRef.current?.isReady()) {
            return;
        }
        clientRef.current.sendRealtimeInput({
            video: {
                data,
                mimeType,
            },
        });
    }, []);

    /**
     * Resume audio contexts
     */
    const resumeAudio = useCallback(async () => {
        if (audioContextRef.current?.state === 'suspended') {
            await audioContextRef.current.resume();
        }
        await audioPlayerRef.current?.resume();
    }, []);

    /**
     * Send tool/function response
     */
    const sendToolResponse = useCallback(
        (id: string, name: string, response: Record<string, unknown>) => {
            if (!clientRef.current?.isReady()) {
                console.warn('[useLiveApi] Cannot send tool response - not ready');
                return;
            }

            clientRef.current.sendToolResponse([
                {
                    functionResponse: { name, response },
                } as any,
            ]);
        },
        []
    );

    /**
     * Set voice for next session
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
        sendVideoFrame,
        sendToolResponse,
        sendAudioStreamEnd,
        resumeAudio,
        setVoice,
        currentVoice,
    };
}

export default useLiveApi;
