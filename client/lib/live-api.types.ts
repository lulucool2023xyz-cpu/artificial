/**
 * Live API Types
 * WebSocket-based real-time communication with Gemini Live API
 * Based on Google's BidiGenerateContent API specification
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
// AVAILABLE MODELS
// ============================================

export const LIVE_API_MODELS = [
    {
        id: 'gemini-2.5-flash-native-audio-preview-12-2025',
        name: 'Gemini 2.5 Flash Native Audio',
        description: 'Latest native audio model with thinking support',
        supportsThinking: true,
    },
    {
        id: 'gemini-live-2.5-flash-preview',
        name: 'Gemini Live 2.5 Flash',
        description: 'Live API optimized model',
        supportsThinking: false,
    },
] as const;

export type LiveApiModel = typeof LIVE_API_MODELS[number]['id'];

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
// VAD (Voice Activity Detection) CONFIG
// ============================================

export type StartSensitivity = 'START_SENSITIVITY_HIGH' | 'START_SENSITIVITY_LOW';
export type EndSensitivity = 'END_SENSITIVITY_HIGH' | 'END_SENSITIVITY_LOW';
export type ActivityHandling = 'START_OF_ACTIVITY_INTERRUPTS' | 'NO_INTERRUPTION';
export type TurnCoverage = 'TURN_INCLUDES_ONLY_ACTIVITY' | 'TURN_INCLUDES_ALL_INPUT';

export interface AutomaticActivityDetectionConfig {
    disabled?: boolean;
    startOfSpeechSensitivity?: StartSensitivity;
    endOfSpeechSensitivity?: EndSensitivity;
    prefixPaddingMs?: number;
    silenceDurationMs?: number;
}

export interface RealtimeInputConfig {
    automaticActivityDetection?: AutomaticActivityDetectionConfig;
    activityHandling?: ActivityHandling;
    turnCoverage?: TurnCoverage;
}

// ============================================
// THINKING CONFIG
// ============================================

export interface ThinkingConfig {
    thinkingBudget?: number; // 0 to disable, -1 for dynamic
    includeThoughts?: boolean;
}

// ============================================
// SESSION MANAGEMENT
// ============================================

export interface SessionResumptionConfig {
    handle?: string;
}

export interface ContextWindowCompressionConfig {
    slidingWindow?: Record<string, unknown>;
    triggerTokens?: number;
}

// ============================================
// CLIENT TO SERVER MESSAGES
// ============================================

export interface SpeechConfig {
    voiceConfig?: {
        prebuiltVoiceConfig?: {
            voiceName: string;
        };
    };
    languageCode?: string;
}

export interface GenerationConfig {
    responseModalities?: ('TEXT' | 'AUDIO')[];
    speechConfig?: SpeechConfig;
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
}

export interface FunctionDeclaration {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
}

export interface LiveApiSetupConfig {
    model?: string;
    generationConfig?: GenerationConfig;
    systemInstruction?: {
        parts: Array<{ text: string }>;
    };
    tools?: Array<{
        functionDeclarations?: FunctionDeclaration[];
        googleSearch?: Record<string, unknown>;
    }>;
    // Audio transcription
    inputAudioTranscription?: Record<string, unknown>;
    outputAudioTranscription?: Record<string, unknown>;
    // VAD and input config
    realtimeInputConfig?: RealtimeInputConfig;
    // Thinking
    thinkingConfig?: ThinkingConfig;
    // Session management
    sessionResumption?: SessionResumptionConfig;
    contextWindowCompression?: ContextWindowCompressionConfig;
    // Proactivity
    proactivity?: {
        proactiveAudio?: boolean;
    };
    // Affective dialog
    enableAffectiveDialog?: boolean;
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
    text?: string;
    activityStart?: boolean;
    activityEnd?: boolean;
    audioStreamEnd?: boolean;
}

export interface ClientContentTurn {
    role: 'user' | 'model';
    parts: Array<{
        text?: string;
        inlineData?: {
            mimeType: string;
            data: string;
        };
    }>;
}

export interface ClientContent {
    turns?: ClientContentTurn[] | string;
    turnComplete?: boolean;
}

export interface FunctionResponse {
    id: string;
    name: string;
    response: Record<string, unknown>;
}

export interface ToolResponsePart {
    functionResponse: Omit<FunctionResponse, 'id'>;
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

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    };
}

export interface GroundingMetadata {
    webSearchQueries?: string[];
    groundingChunks?: GroundingChunk[];
}

export interface ServerContentPayload {
    modelTurn?: {
        parts: ServerContentPart[];
    };
    turnComplete?: boolean;
    interrupted?: boolean;
    generationComplete?: boolean;
    groundingMetadata?: GroundingMetadata;
}

export interface TranscriptionPayload {
    text: string;
}

export interface ToolCallPayload {
    functionCalls: Array<{
        id: string;
        name: string;
        args: Record<string, unknown>;
    }>;
}

export interface ToolCallCancellationPayload {
    ids: string[];
}

export interface GoAwayPayload {
    timeLeft: string; // Duration string
}

export interface SessionResumptionUpdatePayload {
    newHandle: string;
    resumable: boolean;
}

export interface UsageMetadataPayload {
    promptTokenCount?: number;
    responseTokenCount?: number;
    totalTokenCount?: number;
    thoughtsTokenCount?: number;
}

export interface SessionStatusPayload {
    connected: boolean;
    setupComplete: boolean;
    sessionId?: string;
    model?: string;
    sessionHandle?: string;
}

export interface SessionClosedPayload {
    code?: number;
    reason?: string;
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
    voice?: LiveApiVoice;
    systemInstruction?: string;
    // Callbacks
    onConnect?: () => void;
    onSetupComplete?: () => void;
    onAudioResponse?: (audioData: string) => void;
    onTextResponse?: (text: string) => void;
    onInputTranscription?: (text: string) => void;
    onOutputTranscription?: (text: string) => void;
    onToolCall?: (calls: ToolCallPayload['functionCalls']) => void;
    onToolCallCancellation?: (ids: string[]) => void;
    onTurnComplete?: () => void;
    onGenerationComplete?: () => void;
    onInterrupted?: () => void;
    onGoAway?: (timeLeft: string) => void;
    onSessionResumptionUpdate?: (handle: string, resumable: boolean) => void;
    onUsageMetadata?: (usage: UsageMetadataPayload) => void;
    onError?: (error: ErrorPayload) => void;
    onDisconnect?: (reason?: string) => void;
}
