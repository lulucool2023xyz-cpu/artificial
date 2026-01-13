/**
 * Live API Client
 * Real-time bidirectional communication with Gemini via WebSocket
 * Supports audio streaming, transcription, VAD, and session management
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
    SessionStatusPayload,
    ErrorPayload,
    AUDIO_INPUT_CONFIG,
    LiveApiConnectionState,
    ThinkingConfig,
    RealtimeInputConfig,
} from './live-api.types';

export class LiveApiClient {
    private socket: Socket | null = null;
    private config: LiveApiConfig;
    private connectionState: LiveApiConnectionState = 'disconnected';
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 3;

    constructor(config: LiveApiConfig) {
        this.config = config;
    }

    /**
     * Connect to the Live API WebSocket server
     */
    async connect(): Promise<void> {
        if (this.socket?.connected) {
            console.warn('[LiveApi] Already connected');
            return;
        }

        this.connectionState = 'connecting';

        return new Promise((resolve, reject) => {
            try {
                this.socket = io(this.config.url, {
                    transports: ['websocket'],
                    reconnection: true,
                    reconnectionAttempts: this.maxReconnectAttempts,
                    timeout: 10000,
                });

                this.setupEventListeners();

                this.socket.once('connect', () => {
                    this.connectionState = 'connected';
                    this.reconnectAttempts = 0;
                    console.log('[LiveApi] Connected to server');
                    this.config.onConnect?.();
                    resolve();
                });

                this.socket.once('connect_error', (error) => {
                    console.error('[LiveApi] Connection error:', error);
                    this.connectionState = 'error';
                    reject(error);
                });
            } catch (error) {
                this.connectionState = 'error';
                reject(error);
            }
        });
    }

    /**
     * Disconnect from the server
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.connectionState = 'disconnected';
        console.log('[LiveApi] Disconnected');
        this.config.onDisconnect?.();
    }

    /**
     * Setup the Live API session with model and configuration
     */
    setupSession(customConfig?: Partial<LiveApiSetupConfig>): void {
        if (!this.socket?.connected) {
            console.error('[LiveApi] Not connected');
            return;
        }

        this.connectionState = 'setup_pending';

        const setupConfig: LiveApiSetupConfig = {
            model: customConfig?.model || this.config.model || 'gemini-2.5-flash-native-audio-preview-12-2025',
            generationConfig: {
                responseModalities: ['AUDIO', 'TEXT'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: this.config.voice || 'Kore',
                        },
                    },
                    languageCode: 'id-ID',
                },
                temperature: 0.7,
                maxOutputTokens: 4096,
                ...customConfig?.generationConfig,
            },
            // Enable transcription by default
            inputAudioTranscription: customConfig?.inputAudioTranscription ?? {},
            outputAudioTranscription: customConfig?.outputAudioTranscription ?? {},
            // VAD configuration
            realtimeInputConfig: customConfig?.realtimeInputConfig ?? {
                automaticActivityDetection: {
                    disabled: false,
                    startOfSpeechSensitivity: 'START_SENSITIVITY_HIGH',
                    endOfSpeechSensitivity: 'END_SENSITIVITY_HIGH',
                },
            },
            // Thinking config
            thinkingConfig: customConfig?.thinkingConfig,
            // Session resumption
            sessionResumption: customConfig?.sessionResumption,
            // System instruction
            ...(this.config.systemInstruction && {
                systemInstruction: {
                    parts: [{ text: this.config.systemInstruction }],
                },
            }),
            ...customConfig,
        };

        console.log('[LiveApi] Sending setup:', setupConfig.model);
        this.socket.emit('setup', { setup: setupConfig });
    }

    /**
     * Send real-time audio/video/text data
     */
    sendRealtimeInput(data: RealtimeInputData): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Not connected, cannot send input');
            return;
        }

        const input: RealtimeInputData = {};

        if (data.audio) {
            input.audio = {
                data: data.audio.data,
                mimeType: data.audio.mimeType || AUDIO_INPUT_CONFIG.mimeType,
            };
        }

        if (data.video) {
            input.video = {
                data: data.video.data,
                mimeType: data.video.mimeType,
            };
        }

        if (data.text) {
            input.text = data.text;
        }

        if (data.activityStart) {
            input.activityStart = true;
        }

        if (data.activityEnd) {
            input.activityEnd = true;
        }

        if (data.audioStreamEnd) {
            input.audioStreamEnd = true;
        }

        this.socket.emit('realtimeInput', { realtimeInput: input });
    }

    /**
     * Send audio stream end signal (when mic is paused/stopped)
     */
    sendAudioStreamEnd(): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Not connected, cannot send audioStreamEnd');
            return;
        }

        this.socket.emit('audioStreamEnd');
    }

    /**
     * Send activity start (when VAD is disabled)
     */
    sendActivityStart(): void {
        if (!this.socket?.connected) return;
        this.sendRealtimeInput({ activityStart: true });
    }

    /**
     * Send activity end (when VAD is disabled)
     */
    sendActivityEnd(): void {
        if (!this.socket?.connected) return;
        this.sendRealtimeInput({ activityEnd: true });
    }

    /**
     * Send text message
     */
    sendTextMessage(text: string, endOfTurn = true): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Not connected, cannot send message');
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
            console.warn('[LiveApi] Not connected, cannot send content');
            return;
        }

        this.socket.emit('clientContent', { clientContent: content });
    }

    /**
     * Send tool/function response
     */
    sendToolResponse(responses: ToolResponsePart[]): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Not connected, cannot send tool response');
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
     * Get session status
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
     * Check if client is ready for communication
     */
    isReady(): boolean {
        return this.connectionState === 'ready';
    }

    /**
     * Setup socket event listeners
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        // Connected event
        this.socket.on('connected', (payload: { sessionId: string; supportedModels?: string[] }) => {
            console.log('[LiveApi] Server acknowledged connection, session:', payload.sessionId);
        });

        // Setup complete
        this.socket.on('setupComplete', () => {
            this.connectionState = 'ready';
            console.log('[LiveApi] Setup complete, ready for communication');
            this.config.onSetupComplete?.();
        });

        // Server content (audio/text responses)
        this.socket.on('serverContent', (payload: ServerContentPayload) => {
            if (payload.modelTurn?.parts) {
                for (const part of payload.modelTurn.parts) {
                    if (part.inlineData?.data) {
                        // Audio response
                        this.config.onAudioResponse?.(part.inlineData.data);
                    }
                    if (part.text) {
                        // Text response
                        this.config.onTextResponse?.(part.text);
                    }
                }
            }

            if (payload.interrupted) {
                this.config.onInterrupted?.();
            }

            if (payload.generationComplete) {
                this.config.onGenerationComplete?.();
            }

            if (payload.turnComplete) {
                this.config.onTurnComplete?.();
            }
        });

        // Input transcription (user speech)
        this.socket.on('inputTranscription', (payload: TranscriptionPayload) => {
            console.log('[LiveApi] Input transcription:', payload.text);
            this.config.onInputTranscription?.(payload.text);
        });

        // Output transcription (AI speech)
        this.socket.on('outputTranscription', (payload: TranscriptionPayload) => {
            console.log('[LiveApi] Output transcription:', payload.text);
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
            console.log('[LiveApi] Model was interrupted');
            this.config.onInterrupted?.();
        });

        // Tool call
        this.socket.on('toolCall', (payload: ToolCallPayload) => {
            console.log('[LiveApi] Tool call received:', payload);
            this.config.onToolCall?.(payload.functionCalls);
        });

        // Tool call cancellation
        this.socket.on('toolCallCancellation', (payload: ToolCallCancellationPayload) => {
            console.log('[LiveApi] Tool call cancelled:', payload.ids);
            this.config.onToolCallCancellation?.(payload.ids);
        });

        // GoAway (session ending soon)
        this.socket.on('goAway', (payload: GoAwayPayload) => {
            console.log('[LiveApi] GoAway received, time left:', payload.timeLeft);
            this.config.onGoAway?.(payload.timeLeft);
        });

        // Session resumption update
        this.socket.on('sessionResumptionUpdate', (payload: SessionResumptionUpdatePayload) => {
            console.log('[LiveApi] Session resumption update:', payload);
            this.config.onSessionResumptionUpdate?.(payload.newHandle, payload.resumable);
        });

        // Usage metadata
        this.socket.on('usageMetadata', (payload: UsageMetadataPayload) => {
            this.config.onUsageMetadata?.(payload);
        });

        // Status updates
        this.socket.on('status', (payload: SessionStatusPayload) => {
            console.log('[LiveApi] Status:', payload);
        });

        // Session closed
        this.socket.on('sessionClosed', (payload: { reason?: string; code?: number }) => {
            console.log('[LiveApi] Session closed:', payload.reason);
            this.connectionState = 'disconnected';
            this.config.onDisconnect?.(payload.reason);
        });

        // Error
        this.socket.on('error', (payload: ErrorPayload) => {
            console.error('[LiveApi] Error:', payload);
            this.config.onError?.(payload);
        });

        // Disconnect
        this.socket.on('disconnect', (reason) => {
            console.log('[LiveApi] Disconnected:', reason);
            this.connectionState = 'disconnected';
            this.config.onDisconnect?.(reason);
        });

        // Reconnect
        this.socket.on('reconnect', (attemptNumber) => {
            console.log('[LiveApi] Reconnected after', attemptNumber, 'attempts');
            this.connectionState = 'connected';
            this.config.onConnect?.();
        });
    }
}

/**
 * Create a Live API client instance
 */
export function createLiveApiClient(config: Omit<LiveApiConfig, 'url'>): LiveApiClient {
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    const baseUrl = rawBaseUrl.replace(/\/+$/, ''); // Remove trailing slashes
    const wsUrl = baseUrl.replace(/^http/, 'ws').replace(/\/api.*$/, '') + '/live';

    return new LiveApiClient({
        ...config,
        url: wsUrl,
    });
}

export default LiveApiClient;
