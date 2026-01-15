/**
 * Live API Types
 * WebSocket-based real-time communication with Gemini Live API
 * Adapted for Custom Backend Gateway (Native WebSocket)
 */

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
// CONNECTION STATE
// ============================================

export type LiveApiConnectionState =
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'setup_pending'
    | 'ready'
    | 'error';

// ============================================
// CLIENT PAYLOADS
// ============================================

export interface StartSessionPayload {
    systemInstruction?: string;
}

export interface SendAudioPayload {
    audio: string; // Base64
    mimeType?: string;
}

export interface SendVideoPayload {
    video: string; // Base64
    mimeType?: string;
}

export interface SendTextPayload {
    text: string;
}

// ============================================
// SERVER PAYLOADS
// ============================================

export interface ServerMessage {
    type: string;
    data: any;
}

export interface AudioResponsePayload {
    audio: string; // Base64
    mimeType: string;
}

export interface TextResponsePayload {
    text: string;
}

export interface InputTranscriptionPayload {
    text: string;
}

export interface OutputTranscriptionPayload {
    text: string;
}

export interface ErrorPayload {
    message: string;
    code?: string;
}

// ============================================
// LIVE API CLIENT CONFIG
// ============================================

export interface LiveApiConfig {
    url: string;
    systemInstruction?: string;
    // Callbacks
    onConnect?: () => void;
    onSetupComplete?: () => void;
    onAudioResponse?: (audioData: string, mimeType: string) => void;
    onTextResponse?: (text: string) => void;
    onInputTranscription?: (text: string) => void;
    onOutputTranscription?: (text: string) => void;
    onTurnComplete?: () => void;
    onInterrupted?: () => void;
    onSessionStarted?: () => void;
    onSessionClosed?: () => void;
    onError?: (error: ErrorPayload) => void;
    onDisconnect?: (reason?: string) => void;
}
