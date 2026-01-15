/**
 * Live API Client
 * Real-time bidirectional communication with Gemini via WebSocket through backend
 * 
 * IMPORTANT: Audio formats per Gemini Live API docs:
 * - Input: 16-bit PCM, 16kHz, mono (audio/pcm;rate=16000)
 * - Output: 16-bit PCM, 24kHz, mono
 */

import { io, Socket } from 'socket.io-client';
import {
    LiveApiConfig,
    LiveApiSetupConfig,
    RealtimeInputData,
    ClientContent,
    ToolResponsePart,
    ServerContentPayload,
    ToolCallPayload,
    ToolCallCancellationPayload,
    GoAwayPayload,
    SessionResumptionUpdatePayload,
    TranscriptionPayload,
    UsageMetadataPayload,
    ErrorPayload,
    AUDIO_INPUT_CONFIG,
    LiveApiConnectionState,
} from './live-api.types';

export class LiveApiClient {
    private socket: Socket | null = null;
    private config: LiveApiConfig;
    private connectionState: LiveApiConnectionState = 'disconnected';
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 3;

    constructor(config: LiveApiConfig) {
        this.config = config;
    }

    /**
     * Connect to the Live API WebSocket server (backend gateway)
     */
    async connect(): Promise<void> {
        if (this.socket?.connected) {
            console.warn('[LiveApi] Already connected');
            return;
        }

        this.connectionState = 'connecting';
        console.log('[LiveApi] Connecting to:', this.config.url);

        return new Promise((resolve, reject) => {
            try {
                this.socket = io(this.config.url, {
                    transports: ['websocket'],
                    reconnection: true,
                    reconnectionAttempts: this.maxReconnectAttempts,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    timeout: 10000,
                });

                this.setupEventListeners();

                this.socket.once('connect', () => {
                    this.connectionState = 'connected';
                    this.reconnectAttempts = 0;
                    console.log('[LiveApi] ✅ Connected to backend gateway');
                    this.config.onConnect?.();
                    resolve();
                });

                this.socket.once('connect_error', (error) => {
                    console.error('[LiveApi] ❌ Connection error:', error.message);
                    this.connectionState = 'error';
                    reject(error);
                });

            } catch (error) {
                console.error('[LiveApi] ❌ Failed to create socket:', error);
                this.connectionState = 'error';
                reject(error);
            }
        });
    }

    /**
     * Disconnect from server
     */
    disconnect(): void {
        console.log('[LiveApi] Disconnecting...');
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.connectionState = 'disconnected';
        this.config.onDisconnect?.();
    }

    /**
     * Setup the Live API session with Gemini
     * This MUST be called after connect() succeeds
     */
    setupSession(customConfig?: Partial<LiveApiSetupConfig>): void {
        if (!this.socket?.connected) {
            console.error('[LiveApi] Cannot setup session - not connected');
            return;
        }

        this.connectionState = 'setup_pending';

        let sysInstr: { parts: { text: string }[] } | undefined;

        if (customConfig?.systemInstruction) {
            if (typeof customConfig.systemInstruction === 'string') {
                sysInstr = { parts: [{ text: customConfig.systemInstruction }] };
            } else {
                sysInstr = customConfig.systemInstruction as { parts: { text: string }[] };
            }
        } else if (this.config.systemInstruction) {
            sysInstr = { parts: [{ text: this.config.systemInstruction }] };
        } else {
            sysInstr = { parts: [{ text: "You are a helpful assistant." }] };
        }

        const setupConfig: LiveApiSetupConfig = {
            model: customConfig?.model || this.config.model || 'gemini-2.5-flash-native-audio-preview-12-2025',
            systemInstruction: sysInstr,
            generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: this.config.voice || 'Kore',
                        },
                    },
                },
                temperature: 0.7,
                maxOutputTokens: 4096,
                ...customConfig?.generationConfig,
            },
            // Enable transcription by default
            inputAudioTranscription: customConfig?.inputAudioTranscription ?? {},
            outputAudioTranscription: customConfig?.outputAudioTranscription ?? {},
            // VAD configuration (automatic voice detection)
            realtimeInputConfig: customConfig?.realtimeInputConfig ?? {
                automaticActivityDetection: {
                    disabled: false,
                    startOfSpeechSensitivity: 'START_SENSITIVITY_HIGH',
                    endOfSpeechSensitivity: 'END_SENSITIVITY_HIGH',
                },
            },
            // Thinking config (for native audio models)
            thinkingConfig: customConfig?.thinkingConfig,
            // Session resumption
            sessionResumption: customConfig?.sessionResumption,
            // System instruction
            ...(this.config.systemInstruction && {
                systemInstruction: this.config.systemInstruction,
            }),
            ...customConfig,
        };

        console.log('[LiveApi] 🚀 Sending setup:', setupConfig.model);
        this.socket.emit('setup', { setup: setupConfig });
    }

    /**
     * Send real-time audio data
     * 
     * IMPORTANT: Audio MUST be:
     * - Format: PCM 16-bit
     * - Sample Rate: 16kHz  
     * - Channels: Mono
     * - Encoding: Base64
     * - MIME Type: audio/pcm;rate=16000
     */
    sendRealtimeInput(data: RealtimeInputData): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Cannot send - not connected');
            return;
        }

        const input: RealtimeInputData = {};

        // Audio input - must be PCM 16kHz
        if (data.audio) {
            input.audio = {
                data: data.audio.data,
                mimeType: AUDIO_INPUT_CONFIG.mimeType, // audio/pcm;rate=16000
            };
        }

        // Video input - JPEG frames
        if (data.video) {
            input.video = {
                data: data.video.data,
                mimeType: data.video.mimeType || 'image/jpeg',
            };
        }

        // Text input
        if (data.text) {
            input.text = data.text;
        }

        // Activity signals (for manual VAD)
        if (data.activityStart) {
            input.activityStart = true;
        }
        if (data.activityEnd) {
            input.activityEnd = true;
        }

        // Audio stream end (when mic paused)
        if (data.audioStreamEnd) {
            input.audioStreamEnd = true;
        }

        this.socket.emit('realtimeInput', { realtimeInput: input });
    }

    /**
     * Send audio stream end signal
     * Call this when microphone is paused/stopped
     */
    sendAudioStreamEnd(): void {
        if (!this.socket?.connected) {
            return;
        }
        this.socket.emit('audioStreamEnd');
    }

    /**
     * Send text message (while in audio mode too)
     */
    sendTextMessage(text: string, endOfTurn = true): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Cannot send text - not connected');
            return;
        }

        this.socket.emit('clientContent', {
            clientContent: {
                turns: text,
                turnComplete: endOfTurn,
            },
        });
    }

    /**
     * Send client content with turns
     */
    sendClientContent(content: ClientContent): void {
        if (!this.socket?.connected) {
            return;
        }
        this.socket.emit('clientContent', { clientContent: content });
    }

    /**
     * Send tool/function response
     */
    sendToolResponse(responses: ToolResponsePart[]): void {
        if (!this.socket?.connected) {
            return;
        }

        this.socket.emit('toolResponse', {
            toolResponse: {
                functionResponses: responses.map((r) => ({
                    ...r.functionResponse,
                    id: (r as any).id || crypto.randomUUID(),
                })),
            },
        });
    }

    /**
     * Request current session status
     */
    getStatus(): void {
        this.socket?.emit('getStatus');
    }

    /**
     * Get current connection state
     */
    getConnectionState(): LiveApiConnectionState {
        return this.connectionState;
    }

    /**
     * Check if session is ready for communication
     */
    isReady(): boolean {
        return this.connectionState === 'ready';
    }

    /**
     * Setup all socket event listeners
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        // Backend gateway acknowledged connection
        this.socket.on('connected', (payload: { sessionId: string }) => {
            console.log('[LiveApi] Gateway confirmed connection:', payload.sessionId);
        });

        // Setup complete - ready for audio/video input
        this.socket.on('setupComplete', () => {
            this.connectionState = 'ready';
            console.log('[LiveApi] ✅ Setup complete - ready for input');
            this.config.onSetupComplete?.();
        });

        // Server content (audio/text responses from Gemini)
        this.socket.on('serverContent', (payload: ServerContentPayload) => {
            // Process model turn parts
            if (payload.modelTurn?.parts) {
                for (const part of payload.modelTurn.parts) {
                    // Audio response - base64 PCM 24kHz
                    if (part.inlineData?.data) {
                        this.config.onAudioResponse?.(part.inlineData.data);
                    }
                    // Text response
                    if (part.text) {
                        this.config.onTextResponse?.(part.text);
                    }
                }
            }

            // Status events
            if (payload.interrupted) {
                console.log('[LiveApi] Model was interrupted (user spoke)');
                this.config.onInterrupted?.();
            }
            if (payload.generationComplete) {
                this.config.onGenerationComplete?.();
            }
            if (payload.turnComplete) {
                this.config.onTurnComplete?.();
            }
        });

        // Input transcription (what user said)
        this.socket.on('inputTranscription', (payload: TranscriptionPayload) => {
            console.log('[LiveApi] User said:', payload.text);
            this.config.onInputTranscription?.(payload.text);
        });

        // Output transcription (what AI said)
        this.socket.on('outputTranscription', (payload: TranscriptionPayload) => {
            console.log('[LiveApi] AI said:', payload.text);
            this.config.onOutputTranscription?.(payload.text);
        });

        // Turn complete
        this.socket.on('turnComplete', () => {
            this.config.onTurnComplete?.();
        });

        // Generation complete
        this.socket.on('generationComplete', () => {
            this.config.onGenerationComplete?.();
        });

        // Interrupted
        this.socket.on('interrupted', () => {
            console.log('[LiveApi] Interrupted');
            this.config.onInterrupted?.();
        });

        // Tool call request
        this.socket.on('toolCall', (payload: ToolCallPayload) => {
            console.log('[LiveApi] Tool call:', payload);
            this.config.onToolCall?.(payload.functionCalls);
        });

        // Tool call cancellation
        this.socket.on('toolCallCancellation', (payload: ToolCallCancellationPayload) => {
            console.log('[LiveApi] Tool call cancelled:', payload.ids);
            this.config.onToolCallCancellation?.(payload.ids);
        });

        // GoAway - session ending soon
        this.socket.on('goAway', (payload: GoAwayPayload) => {
            console.warn('[LiveApi] ⚠️ GoAway - session ending:', payload.timeLeft);
            this.config.onGoAway?.(payload.timeLeft);
        });

        // Session resumption update
        this.socket.on('sessionResumptionUpdate', (payload: SessionResumptionUpdatePayload) => {
            console.log('[LiveApi] Session handle updated');
            this.config.onSessionResumptionUpdate?.(payload.newHandle, payload.resumable);
        });

        // Usage metadata
        this.socket.on('usageMetadata', (payload: UsageMetadataPayload) => {
            this.config.onUsageMetadata?.(payload);
        });

        // Session closed by Gemini
        this.socket.on('sessionClosed', (payload: { reason?: string; code?: number }) => {
            console.log('[LiveApi] Session closed:', payload.reason);
            this.connectionState = 'disconnected';
            this.config.onDisconnect?.(payload.reason);
        });

        // Error from backend or Gemini
        this.socket.on('error', (payload: ErrorPayload) => {
            console.error('[LiveApi] ❌ Error:', payload.code, payload.message);
            this.config.onError?.(payload);
        });

        // Socket disconnect
        this.socket.on('disconnect', (reason) => {
            console.log('[LiveApi] Disconnected:', reason);
            this.connectionState = 'disconnected';
            this.config.onDisconnect?.(reason);
        });

        // Reconnection
        this.socket.on('reconnect', (attemptNumber) => {
            console.log('[LiveApi] Reconnected after', attemptNumber, 'attempts');
            this.connectionState = 'connected';
            this.config.onConnect?.();
        });
    }
}

/**
 * Create a Live API client instance with proper URL configuration
 */
export function createLiveApiClient(config: Omit<LiveApiConfig, 'url'>): LiveApiClient {
    // Get base URL from environment
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    // Clean up URL - remove trailing slashes and /api suffix
    const baseUrl = rawBaseUrl
        .replace(/\/+$/, '')
        .replace(/\/api$/, '');

    // Convert to WebSocket URL for Socket.io
    // Note: Socket.io handles ws:// vs http:// internally, so we use http/https
    const socketUrl = baseUrl + '/live';

    console.log('[LiveApi] Creating client with URL:', socketUrl);

    return new LiveApiClient({
        ...config,
        url: socketUrl,
    });
}

export default LiveApiClient;
