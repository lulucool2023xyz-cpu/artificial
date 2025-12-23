/**
 * Live API Client
 * Real-time bidirectional communication with Gemini via WebSocket
 */

import { io, Socket } from 'socket.io-client';
import {
    LiveApiConfig,
    LiveApiSetupConfig,
    RealtimeInputData,
    ClientContentTurn,
    ToolResponsePart,
    ServerContentPayload,
    ToolCallPayload,
    SessionStatusPayload,
    ErrorPayload,
    AUDIO_INPUT_CONFIG,
    LiveApiConnectionState,
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
            model: customConfig?.model || this.config.model || 'gemini-2.5-flash-native-audio-preview',
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
            ...(this.config.systemInstruction && {
                systemInstruction: {
                    parts: [{ text: this.config.systemInstruction }],
                },
            }),
            ...customConfig,
        };

        console.log('[LiveApi] Sending setup:', setupConfig);
        this.socket.emit('setup', { setup: setupConfig });
    }

    /**
     * Send real-time audio/video data
     */
    sendRealtimeInput(data: RealtimeInputData): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Not connected, cannot send input');
            return;
        }

        this.socket.emit('realtimeInput', {
            realtimeInput: {
                mediaChunks: [
                    {
                        mimeType: data.audio?.mimeType || AUDIO_INPUT_CONFIG.mimeType,
                        data: data.audio?.data || data.video?.data,
                    },
                ],
            },
        });
    }

    /**
     * Send text message
     */
    sendTextMessage(text: string, endOfTurn = true): void {
        if (!this.socket?.connected) {
            console.warn('[LiveApi] Not connected, cannot send message');
            return;
        }

        const clientContent: ClientContentTurn = {
            role: 'user',
            parts: [{ text }],
        };

        this.socket.emit('clientContent', {
            clientContent: {
                turns: [clientContent],
                turnComplete: endOfTurn,
            },
        });
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
                functionResponses: responses.map((r) => r.functionResponse),
            },
        });
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
        this.socket.on('connected', () => {
            console.log('[LiveApi] Server acknowledged connection');
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

            if (payload.turnComplete) {
                this.config.onTurnComplete?.();
            }
        });

        // Tool call
        this.socket.on('toolCall', (payload: ToolCallPayload) => {
            console.log('[LiveApi] Tool call received:', payload);
            this.config.onToolCall?.(payload.functionCalls);
        });

        // Status updates
        this.socket.on('status', (payload: SessionStatusPayload) => {
            console.log('[LiveApi] Status:', payload);
        });

        // Session closed
        this.socket.on('sessionClosed', (payload: { reason?: string }) => {
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
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const wsUrl = baseUrl.replace(/^http/, 'ws').replace(/\/api.*$/, '') + '/live';

    return new LiveApiClient({
        ...config,
        url: wsUrl,
    });
}

export default LiveApiClient;
