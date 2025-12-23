/**
 * Live API Types
 * WebSocket-based real-time communication with Gemini
 */

// ============================================
// CLIENT TO SERVER MESSAGES
// ============================================

export interface LiveApiSetupConfig {
    model?: string;
    generationConfig?: {
        responseModalities?: string[];
        speechConfig?: {
            voiceConfig?: {
                prebuiltVoiceConfig?: {
                    voiceName: string;
                };
            };
            languageCode?: string;
        };
        temperature?: number;
        maxOutputTokens?: number;
    };
    systemInstruction?: {
        parts: Array<{ text: string }>;
    };
    tools?: Array<{
        functionDeclarations?: Array<{
            name: string;
            description: string;
            parameters?: Record<string, unknown>;
        }>;
    }>;
}

export interface RealtimeInputData {
    audio?: {
        data: string; // Base64 PCM audio
        mimeType?: string;
    };
    video?: {
        data: string; // Base64 video frame
        mimeType?: string;
    };
}

export interface ClientContentTurn {
    role: 'user';
    parts: Array<{
        text?: string;
        inlineData?: {
            mimeType: string;
            data: string;
        };
    }>;
}

export interface ToolResponsePart {
    functionResponse: {
        name: string;
        response: Record<string, unknown>;
    };
}

// ============================================
// SERVER TO CLIENT MESSAGES
// ============================================

export interface ServerContentPart {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string; // Base64 audio data
    };
    executableCode?: {
        language: string;
        code: string;
    };
    codeExecutionResult?: {
        outcome: string;
        output: string;
    };
}

export interface ServerContentPayload {
    modelTurn?: {
        parts: ServerContentPart[];
    };
    turnComplete?: boolean;
    interrupted?: boolean;
    groundingMetadata?: {
        webSearchQueries?: string[];
        groundingChunks?: Array<{
            web?: {
                uri: string;
                title: string;
            };
        }>;
    };
}

export interface ToolCallPayload {
    functionCalls: Array<{
        id: string;
        name: string;
        args: Record<string, unknown>;
    }>;
}

export interface SessionStatusPayload {
    connected: boolean;
    sessionId?: string;
    model?: string;
    error?: string;
}

export interface SessionClosedPayload {
    reason?: string;
    code?: number;
}

export interface ErrorPayload {
    code: string;
    message: string;
    details?: unknown;
}

// ============================================
// LIVE API CLIENT CONFIG
// ============================================

export interface LiveApiConfig {
    url: string;
    model?: string;
    voice?: string;
    systemInstruction?: string;
    onConnect?: () => void;
    onSetupComplete?: () => void;
    onAudioResponse?: (audioData: string) => void;
    onTextResponse?: (text: string) => void;
    onToolCall?: (calls: ToolCallPayload['functionCalls']) => void;
    onTurnComplete?: () => void;
    onError?: (error: ErrorPayload) => void;
    onDisconnect?: (reason?: string) => void;
}

// ============================================
// AUDIO FORMAT CONSTANTS
// ============================================

export const AUDIO_INPUT_CONFIG = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    mimeType: 'audio/pcm;rate=16000'
} as const;

export const AUDIO_OUTPUT_CONFIG = {
    sampleRate: 24000,
    channels: 1,
    bitsPerSample: 16,
    mimeType: 'audio/pcm;rate=24000'
} as const;

// ============================================
// AVAILABLE VOICES
// ============================================

export const LIVE_API_VOICES = [
    { id: 'Kore', name: 'Kore', description: 'Firm, professional voice' },
    { id: 'Aoede', name: 'Aoede', description: 'Warm, melodic voice' },
    { id: 'Charon', name: 'Charon', description: 'Deep, authoritative voice' },
    { id: 'Fenrir', name: 'Fenrir', description: 'Strong, confident voice' },
    { id: 'Puck', name: 'Puck', description: 'Playful, energetic voice' },
    { id: 'Orbit', name: 'Orbit', description: 'Calm, spacey voice' },
] as const;

export type LiveApiVoice = typeof LIVE_API_VOICES[number]['id'];

// ============================================
// CONNECTION STATE
// ============================================

export type LiveApiConnectionState =
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'setup_pending'
    | 'ready'
    | 'error';
