/**
 * Live API Client
 * Real-time bidirectional communication with Gemini via WebSocket through backend
 * Refactored for Native WebSocket and Production Support
 */

import {
    LiveApiConfig,
    LiveApiConnectionState,
    AUDIO_INPUT_CONFIG,
    ServerMessage
} from './live-api.types';

export class LiveApiClient {
    private socket: WebSocket | null = null;
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
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.warn('[LiveApi] Already connected');
            return;
        }

        this.connectionState = 'connecting';
        console.log('[LiveApi] Connecting to:', this.config.url);

        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(this.config.url);

                this.setupEventListeners(resolve, reject);

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
            this.socket.close();
            this.socket = null;
        }
        this.connectionState = 'disconnected';
        this.config.onDisconnect?.();
    }

    /**
     * Setup the Live API session
     * Sends 'start-session' event to the backend
     */
    setupSession(customConfig?: { systemInstruction?: string }): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('[LiveApi] Cannot setup session - not connected');
            return;
        }

        this.connectionState = 'setup_pending';

        const systemInstruction = customConfig?.systemInstruction || this.config.systemInstruction;

        console.log('[LiveApi] 🚀 Sending start-session request');
        this.sendMessage('start-session', { systemInstruction });
    }

    /**
     * Send real-time audio data
     */
    sendAudio(base64Data: string, mimeType: string = 'audio/pcm;rate=16000'): void {
        if (!this.isReady()) {
            // console.warn('[LiveApi] Cannot send audio - session not ready');
            return;
        }

        this.sendMessage('send-audio', {
            audio: base64Data,
            mimeType,
        });
    }

    /**
     * Send real-time video data
     */
    sendVideo(base64Data: string, mimeType: string = 'image/jpeg'): void {
        if (!this.isReady()) {
            return;
        }

        this.sendMessage('send-video', {
            video: base64Data,
            mimeType,
        });
    }

    /**
     * Send text message
     */
    sendTextMessage(text: string): void {
        if (!this.isReady()) {
            console.warn('[LiveApi] Cannot send text - session not ready');
            return;
        }

        this.sendMessage('send-text', { text });
    }

    /**
     * Helper to send JSON messages
     */
    private sendMessage(event: string, data: any = {}): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ event, data }));
        }
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
        return this.connectionState === 'ready' || this.connectionState === 'connected';
    }

    /**
     * Setup all socket event listeners
     */
    private setupEventListeners(resolve: () => void, reject: (err: any) => void): void {
        if (!this.socket) return;

        this.socket.onopen = () => {
            this.connectionState = 'connected';
            this.reconnectAttempts = 0;
            console.log('[LiveApi] ✅ WebSocket Connected');
            this.config.onConnect?.();
            resolve();
        };

        this.socket.onerror = (event) => {
            console.error('[LiveApi] ❌ Connection error:', event);
            if (this.connectionState === 'connecting') {
                reject(new Error('WebSocket connection failed'));
            }
            this.connectionState = 'error';
            this.config.onError?.({ message: 'WebSocket connection error' });
        };

        this.socket.onclose = () => {
            console.log('[LiveApi] WebSocket closed');
            this.connectionState = 'disconnected';
            this.config.onDisconnect?.();
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                // console.log('[LiveApi] Received:', message.type);

                switch (message.type) {
                    case 'connected':
                        // Handled by onopen mostly, but good to know backend accepted
                        break;

                    case 'session-started':
                        this.connectionState = 'ready'; // Ready to stream
                        console.log('[LiveApi] Session started!');
                        this.config.onSessionStarted?.();
                        break;

                    case 'setup-complete':
                        console.log('[LiveApi] Setup complete');
                        this.config.onSetupComplete?.();
                        break;

                    case 'audio-response':
                        if (message.data?.audio) {
                            this.config.onAudioResponse?.(message.data.audio, message.data.mimeType);
                        }
                        break;

                    case 'text-response':
                        if (message.data?.text) {
                            this.config.onTextResponse?.(message.data.text);
                        }
                        break;

                    case 'input-transcription':
                        if (message.data?.text) {
                            this.config.onInputTranscription?.(message.data.text);
                        }
                        break;

                    case 'output-transcription':
                        if (message.data?.text) {
                            this.config.onOutputTranscription?.(message.data.text);
                        }
                        break;

                    case 'turn-complete':
                        this.config.onTurnComplete?.();
                        break;

                    case 'interrupted':
                        console.log('[LiveApi] Interrupted');
                        this.config.onInterrupted?.();
                        break;

                    case 'session-closed':
                    case 'session-ended':
                        console.log('[LiveApi] Session ended');
                        this.connectionState = 'connected'; // Back to connected but no session
                        this.config.onSessionClosed?.();
                        break;

                    case 'error':
                        console.error('[LiveApi] Server error:', message.data.message);
                        this.config.onError?.({ message: message.data.message });
                        break;
                }

            } catch (error) {
                console.error('[LiveApi] Error parsing message:', error);
            }
        };
    }
}

/**
 * Create a Live API client instance with proper URL configuration
 * Supports Production URL automatically
 */
export function createLiveApiClient(config: Omit<LiveApiConfig, 'url'>): LiveApiClient {
    // 1. Get base URL from Vite environment variable (if set in production)
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // 2. Or fallback to current window location if in browser (mostly for same-origin deps)
    // 3. Or fallback to localhost for dev
    let baseUrl = envBaseUrl || 'http://localhost:3001';

    // If we are in browser and no env var, and not localhost, might want to infer from window.location
    // But usually VITE_API_BASE_URL should be set. 
    // If not set, and we are on https://orenax.up.railway.app, we probably want wss://orenax.up.railway.app

    if (!envBaseUrl && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        baseUrl = window.location.origin;
    }

    // Clean up URL
    baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

    // Determine WebSocket protocol (ws:// or wss://)
    const isSecure = baseUrl.startsWith('https:') || (typeof window !== 'undefined' && window.location.protocol === 'https:');
    const wsProtocol = isSecure ? 'wss://' : 'ws://';

    // Strip http/https to get host
    const host = baseUrl.replace(/^https?:\/\//, '');

    // Construct final WebSocket URL
    const socketUrl = `${wsProtocol}${host}`;

    console.log(`[LiveApi] Configured URL: ${socketUrl} (Secure: ${isSecure})`);

    return new LiveApiClient({
        ...config,
        url: socketUrl,
    });
}

export default LiveApiClient;
