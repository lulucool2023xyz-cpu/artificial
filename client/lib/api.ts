/**
 * API Service Layer
 * Handles communication with backend endpoints
 */

// Base URL from environment variable (remove trailing slash if present)
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expires';
const USER_KEY = 'auth_user';

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store auth tokens
 */
export const storeAuthTokens = (accessToken: string, refreshToken: string, expiresAt?: number): void => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (expiresAt) {
        sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
    }
};

/**
 * Store user data
 */
export const storeUser = (user: any): void => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get stored user
 */
export const getStoredUser = (): any | null => {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

/**
 * Clear all auth data and user-specific data
 */
export const clearAuthData = (): void => {
    // Clear session storage (auth tokens)
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(USER_KEY);

    // Clear localStorage user-specific data (chat history, settings, profile)
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('appSettings');
    localStorage.removeItem('termsAccepted');
};

/**
 * Generic API call helper
 */
export async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add auth token if available
    const token = getAccessToken();
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
}

// ============================================
// AUTH API
// ============================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    message: string;
    user: {
        id: string;
        email: string;
        name?: string;
        fullName?: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
    expiresAt?: number;
}

export interface RefreshResponse {
    message: string;
    session: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        expires_at: number;
    };
}

export const authApi = {
    /**
     * Login with email and password
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return apiCall<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Register new user
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        return apiCall<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Logout current user
     */
    logout: async (): Promise<{ message: string }> => {
        return apiCall<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    },

    /**
     * Refresh access token
     */
    refresh: async (refreshToken: string): Promise<RefreshResponse> => {
        return apiCall<RefreshResponse>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    },

    /**
     * Get current user info
     */
    me: async (): Promise<{ user: AuthResponse['user'] }> => {
        return apiCall<{ user: AuthResponse['user'] }>('/auth/me', {
            method: 'GET',
        });
    },

    /**
     * Get OAuth URL for social login
     */
    getOAuthUrl: async (provider: 'google' | 'facebook' | 'github', redirectTo?: string): Promise<{ url: string; provider: string }> => {
        const params = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : '';
        return apiCall<{ url: string; provider: string }>(`/auth/${provider}/url${params}`, {
            method: 'GET',
        });
    },

    /**
     * Exchange OAuth code for session
     */
    exchangeOAuthCode: async (code: string): Promise<AuthResponse> => {
        return apiCall<AuthResponse>('/auth/callback', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    },

    /**
     * Request password reset email
     */
    forgotPassword: async (email: string, redirectTo?: string): Promise<{ message: string; success: boolean }> => {
        return apiCall<{ message: string; success: boolean }>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email, redirectTo }),
        });
    },

    /**
     * Update password with token from reset email
     */
    updatePassword: async (accessToken: string, newPassword: string): Promise<{ message: string; success: boolean }> => {
        return apiCall<{ message: string; success: boolean }>('/auth/update-password', {
            method: 'POST',
            body: JSON.stringify({ accessToken, newPassword }),
        });
    },
};

// ============================================
// CHAT API (V2 Stream)
// ============================================

export interface ChatContent {
    role: 'user' | 'model';
    parts: ChatPart[];
}

export interface ChatPart {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string; // base64
    };
}

export interface ThinkingConfig {
    thinkingBudget?: number; // 0-24576 for Flash, 128-32768 for Pro, -1 for dynamic
    thinkingLevel?: 'low' | 'high'; // For Gemini 3 models
    includeThoughts?: boolean;
}

export interface GoogleSearchConfig {
    // Google Search uses empty object - no config needed
    [key: string]: unknown;
}

export interface ChatTool {
    googleSearch?: GoogleSearchConfig;
    codeExecution?: Record<string, unknown>;
}

export interface ChatStreamRequest {
    contents?: ChatContent[];
    prompt?: string;
    model?: string;
    stream?: boolean;
    systemInstruction?: string;
    generationConfig?: {
        temperature?: number;
        maxOutputTokens?: number;
        topP?: number;
    };
    thinkingConfig?: ThinkingConfig;
    tools?: ChatTool[];
}

export interface ChatStreamChunk {
    text?: string;
    thought?: string;
    done?: boolean;
    finishReason?: string;
    usageMetadata?: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        thoughtsTokenCount?: number;
        totalTokenCount: number;
    };
    groundingMetadata?: {
        groundingChunks?: Array<{
            web?: {
                uri: string;
                title: string;
            };
        }>;
        webSearchQueries?: string[];
    };
    // Function calling support
    functionCall?: {
        name: string;
        args: Record<string, unknown>;
    };
    // Code execution support
    codeExecutionResult?: {
        outcome: 'OUTCOME_OK' | 'OUTCOME_FAILED';
        output?: string;
    };
    error?: boolean;
    message?: string;
}

export const chatApi = {
    /**
     * Stream chat response via SSE
     * Returns an async generator that yields chunks
     */
    streamChat: async function* (
        request: ChatStreamRequest
    ): AsyncGenerator<ChatStreamChunk, void, unknown> {
        const url = `${API_BASE_URL}/api/v2/chat/stream`;
        const token = getAccessToken();

        const requestPayload = {
            ...request,
            stream: true,
        };

        // Debug: Log request payload including thinkingConfig
        console.log('[API] Sending chat request:', {
            model: request.model,
            hasThinkingConfig: !!request.thinkingConfig,
            thinkingConfig: request.thinkingConfig,
            hasTools: !!request.tools?.length,
            tools: request.tools,
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Chat API Error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Keep the last incomplete line in buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

                    const data = trimmedLine.slice(6); // Remove "data: " prefix

                    if (data === '[DONE]') {
                        return;
                    }

                    try {
                        const chunk: ChatStreamChunk = JSON.parse(data);

                        // Debug: Log thought chunks when received
                        if (chunk.thought) {
                            console.log('[API] Received thought chunk:', chunk.thought);
                        }
                        if (chunk.text) {
                            console.log('[API] Received text chunk length:', chunk.text.length);
                        }

                        yield chunk;

                        if (chunk.done) {
                            return;
                        }
                    } catch {
                        // Skip invalid JSON
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    },

    /**
     * Non-streaming chat (for simple use cases)
     */
    chat: async (request: ChatStreamRequest): Promise<any> => {
        return apiCall('/api/v2/chat', {
            method: 'POST',
            body: JSON.stringify({
                ...request,
                stream: false,
            }),
        });
    },
};

// ============================================
// MODELS API
// ============================================

export interface GeminiModel {
    name: string;
    displayName: string;
    description: string;
    supportsThinking: boolean;
    thinkingType: 'budget' | 'level' | null;
    maxInputTokens: number;
    maxOutputTokens: number;
    supportedFeatures: string[];
}

export interface ModelsResponse {
    models: GeminiModel[];
    defaultModel: string;
}

export const modelsApi = {
    /**
     * Get list of available models
     */
    list: async (): Promise<ModelsResponse> => {
        return apiCall<ModelsResponse>('/api/v2/models', {
            method: 'GET',
        });
    },
};

// ============================================
// CULTURE API (AI Culture Assistant)
// ============================================

export interface CultureQueryRequest {
    query: string;
    type?: 'story' | 'craft' | 'ritual' | 'province' | 'identify';
    includeThinking?: boolean;
    enableSearch?: boolean;
}

export interface CultureResponse {
    content: string;
    sources?: Array<{ title: string; url: string }>;
    thoughts?: string[];
}

export const cultureApi = {
    /**
     * Query AI for cultural information with thinking mode
     */
    getCultureInfo: async (request: CultureQueryRequest): Promise<CultureResponse> => {
        const systemInstruction = `Kamu adalah asisten budaya Indonesia yang ahli. Berikan informasi yang akurat, mendalam, dan menarik tentang budaya Indonesia.
Format respons dalam markdown dengan:
- Bold (**) untuk judul dan kata penting
- Bullet points (-) untuk daftar
- Penjelasan yang jelas dan terstruktur

Jika diminta tentang cerita rakyat, sertakan:
1. Asal daerah
2. Tokoh utama
3. Ringkasan cerita
4. Pelajaran moral

Jika diminta tentang kerajinan, sertakan:
1. Asal daerah
2. Teknik pembuatan
3. Makna filosofis
4. Status UNESCO jika ada`;

        const typePrompts: Record<string, string> = {
            story: 'Ceritakan legenda/cerita rakyat Indonesia tentang: ',
            craft: 'Jelaskan kerajinan tradisional Indonesia tentang: ',
            ritual: 'Jelaskan ritual/tradisi adat Indonesia tentang: ',
            province: 'Jelaskan budaya dan tradisi dari provinsi: ',
            identify: 'Identifikasi dan jelaskan warisan budaya Indonesia ini: ',
        };

        const prompt = request.type
            ? `${typePrompts[request.type]}${request.query}`
            : request.query;

        try {
            const chatRequest: ChatStreamRequest = {
                prompt,
                model: 'gemini-2.5-flash',
                systemInstruction,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                },
                thinkingConfig: request.includeThinking ? {
                    thinkingBudget: 4096,
                    includeThoughts: true,
                } : undefined,
                tools: request.enableSearch ? [{ googleSearch: {} }] : undefined,
            };

            // Use non-streaming for simpler response handling
            const response = await chatApi.chat(chatRequest);

            const sources: Array<{ title: string; url: string }> = [];
            if (response.groundingMetadata?.groundingChunks) {
                for (const chunk of response.groundingMetadata.groundingChunks) {
                    if (chunk.web) {
                        sources.push({
                            title: chunk.web.title || 'Source',
                            url: chunk.web.uri,
                        });
                    }
                }
            }

            return {
                content: response.message?.content || response.text || '',
                sources: sources.length > 0 ? sources : undefined,
                thoughts: response.thoughts,
            };
        } catch (error) {
            console.error('Culture API error:', error);
            throw error;
        }
    },

    /**
     * Stream cultural information (for longer responses)
     */
    streamCultureInfo: async function* (
        request: CultureQueryRequest
    ): AsyncGenerator<{ text?: string; thought?: string; done: boolean; sources?: Array<{ title: string; url: string }> }, void, unknown> {
        const systemInstruction = `Kamu adalah asisten budaya Indonesia yang ahli. Berikan informasi yang akurat, mendalam, dan menarik tentang budaya Indonesia dalam format markdown.`;

        const prompt = request.query;

        const chatRequest: ChatStreamRequest = {
            prompt,
            model: 'gemini-2.5-flash',
            systemInstruction,
            stream: true,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096,
            },
            thinkingConfig: request.includeThinking ? {
                thinkingBudget: 4096,
                includeThoughts: true,
            } : undefined,
            tools: request.enableSearch ? [{ googleSearch: {} }] : undefined,
        };

        const sources: Array<{ title: string; url: string }> = [];

        for await (const chunk of chatApi.streamChat(chatRequest)) {
            // Collect sources from grounding metadata
            if (chunk.groundingMetadata?.groundingChunks) {
                for (const gc of chunk.groundingMetadata.groundingChunks) {
                    if (gc.web && !sources.some(s => s.url === gc.web?.uri)) {
                        sources.push({
                            title: gc.web.title || 'Source',
                            url: gc.web.uri,
                        });
                    }
                }
            }

            yield {
                text: chunk.text,
                thought: chunk.thought,
                done: chunk.done || false,
                sources: sources.length > 0 ? sources : undefined,
            };

            if (chunk.done) break;
        }
    },

    /**
     * Analyze an image to identify Indonesian cultural heritage
     * Uses Gemini Vision API for image understanding
     */
    analyzeImage: async (imageBase64: string, mimeType: string = 'image/jpeg'): Promise<{
        title: string;
        location: string;
        confidence: number;
        summary: string;
        whatIsThis: string;
        whereFrom: { city: string; description: string };
        howItsMade: Array<{ step: number; title: string; description: string }>;
        meaning: { symbolism: string; usage: string; history: string };
        error?: string;
    }> => {
        const systemInstruction = `Kamu adalah ahli warisan budaya Indonesia. Analisis gambar dan identifikasi warisan budaya yang terlihat.

PENTING: Respons HARUS dalam format JSON yang valid dengan struktur berikut:
{
    "title": "Nama warisan budaya",
    "location": "Daerah asal, Indonesia",
    "confidence": 85,
    "summary": "Ringkasan singkat 1-2 kalimat",
    "whatIsThis": "Penjelasan detail tentang apa ini",
    "whereFrom": {
        "city": "Kota/Daerah asal",
        "description": "Penjelasan sejarah daerah"
    },
    "howItsMade": [
        { "step": 1, "title": "Langkah 1", "description": "Deskripsi langkah" }
    ],
    "meaning": {
        "symbolism": "Makna simbolis",
        "usage": "Cara penggunaan tradisional",
        "history": "Sejarah singkat"
    }
}

Berikan analisis mendalam berdasarkan visual yang terlihat.`;

        try {
            const response = await chatApi.chat({
                contents: [{
                    role: 'user',
                    parts: [
                        { text: 'Identifikasi dan analisis warisan budaya Indonesia dalam gambar ini. Respond dalam format JSON.' },
                        { inlineData: { mimeType, data: imageBase64.replace(/^data:image\/\w+;base64,/, '') } }
                    ]
                }],
                model: 'gemini-2.5-flash',
                systemInstruction,
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 2048,
                },
            });

            const content = response.text || response.message?.content || '';

            // Extract JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0]);
                } catch {
                    // If JSON parsing fails, create structured response from text
                    return {
                        title: 'Warisan Budaya Indonesia',
                        location: 'Indonesia',
                        confidence: 70,
                        summary: content.slice(0, 200),
                        whatIsThis: content,
                        whereFrom: { city: 'Indonesia', description: 'Warisan budaya Nusantara' },
                        howItsMade: [{ step: 1, title: 'Pembuatan Tradisional', description: 'Dibuat dengan teknik tradisional' }],
                        meaning: { symbolism: 'Simbol budaya', usage: 'Penggunaan tradisional', history: 'Warisan turun-temurun' }
                    };
                }
            }

            return {
                title: 'Warisan Budaya Indonesia',
                location: 'Indonesia',
                confidence: 60,
                summary: content.slice(0, 200),
                whatIsThis: content,
                whereFrom: { city: 'Indonesia', description: 'Warisan budaya Nusantara' },
                howItsMade: [{ step: 1, title: 'Pembuatan Tradisional', description: 'Dibuat dengan teknik tradisional' }],
                meaning: { symbolism: 'Simbol budaya', usage: 'Penggunaan tradisional', history: 'Warisan turun-temurun' }
            };
        } catch (error) {
            console.error('Culture image analysis error:', error);
            throw error;
        }
    },

    /**
     * Get province cultural information
     */
    getProvinceInfo: async (provinceName: string): Promise<CultureResponse> => {
        return cultureApi.getCultureInfo({
            query: provinceName,
            type: 'province',
            enableSearch: true,
        });
    },
};

// ============================================
// TTS API (Text-to-Speech)
// ============================================

export interface TtsVoice {
    name: string;
    displayName: string;
    description?: string;
    languageCodes?: string[];
}

export interface SingleTtsRequest {
    text: string;
    voiceName?: string;
    model?: string;
}

export interface MultiTtsRequest {
    text: string;
    speakerConfigs: Array<{
        speaker: string;
        voiceName: string;
    }>;
    model?: string;
}

export interface TtsResponse {
    audioUrl?: string;
    mimeType?: string;
    durationMs?: number;
    model?: string;
    voice?: string;
    error?: string;
}

export const ttsApi = {
    /**
     * Get available TTS voices
     */
    getVoices: async (): Promise<{ voices: TtsVoice[] }> => {
        return apiCall<{ voices: TtsVoice[] }>('/api/v2/tts/voices', {
            method: 'GET',
        });
    },

    /**
     * Synthesize speech from text (single voice)
     */
    synthesizeSingle: async (request: SingleTtsRequest): Promise<TtsResponse> => {
        return apiCall<TtsResponse>('/api/v2/tts/single', {
            method: 'POST',
            body: JSON.stringify({
                text: request.text,
                voiceName: request.voiceName || 'Kore',
                model: request.model || 'gemini-2.5-flash-preview-tts',
            }),
        });
    },

    /**
     * Synthesize speech from text (multi-speaker)
     */
    synthesizeMulti: async (request: MultiTtsRequest): Promise<TtsResponse> => {
        return apiCall<TtsResponse>('/api/v2/tts/multi', {
            method: 'POST',
            body: JSON.stringify({
                text: request.text,
                speakerConfigs: request.speakerConfigs,
                model: request.model || 'gemini-2.5-flash-preview-tts',
            }),
        });
    },

    /**
     * Get TTS service status
     */
    getStatus: async (): Promise<{ status: string; model: string }> => {
        return apiCall<{ status: string; model: string }>('/api/v2/tts/status', {
            method: 'GET',
        });
    },
};

// ============================================
// MUSIC GENERATION API
// ============================================

export interface MusicPrompt {
    text: string;
    weight?: number; // 0.0 to 1.0, default 1.0
}

export interface MusicRequest {
    prompts: MusicPrompt[];
    durationSeconds?: number; // 5-30 seconds
    bpm?: number; // 60-200
    temperature?: number; // 0.0-2.0, default 1.0
    scale?: 'MAJOR' | 'MINOR' | 'PENTATONIC' | 'CHROMATIC';
    density?: 'LOW' | 'MEDIUM' | 'HIGH';
    brightness?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MusicResponse {
    audioUrl?: string;
    mimeType?: string;
    durationMs?: number;
    model?: string;
    sampleRate?: number;
    error?: string;
}

export const musicApi = {
    /**
     * Generate music from prompts
     */
    generate: async (request: MusicRequest): Promise<MusicResponse> => {
        return apiCall<MusicResponse>('/api/v2/music/generate', {
            method: 'POST',
            body: JSON.stringify({
                prompts: request.prompts,
                durationSeconds: request.durationSeconds || 15,
                generationConfig: {
                    bpm: request.bpm,
                    temperature: request.temperature || 1.0,
                    scale: request.scale,
                    density: request.density,
                    brightness: request.brightness,
                },
            }),
        });
    },

    /**
     * Get music generation service status
     */
    getStatus: async (): Promise<{ status: string; model: string }> => {
        return apiCall<{ status: string; model: string }>('/api/v2/music/status', {
            method: 'GET',
        });
    },
};

// ============================================
// PAYMENT & SUBSCRIPTION API (V2)
// ============================================

export type PlanId = 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface CreateOrderRequest {
    planId: PlanId;
    billingCycle: BillingCycle;
}

export interface CreateOrderResponse {
    orderId: string;
    snapToken: string;
    amount: number;
    currency: 'IDR';
    expiresAt: string;
}

export interface VerifyPaymentRequest {
    orderId: string;
    transactionId?: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    subscription: {
        planId: PlanId;
        expiresAt: string;
        status: SubscriptionStatus;
    };
    message: string;
}

export interface SubscriptionStatusResponse {
    isActive: boolean;
    plan: SubscriptionPlan;
    expiresAt: string | null;
    features: string[];
    daysRemaining: number | null;
}

export const subscriptionApi = {
    /**
     * Create a payment order for subscription
     */
    createOrder: async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
        return apiCall<CreateOrderResponse>('/api/v2/payment/create-order', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    /**
     * Verify payment after Midtrans callback
     */
    verifyPayment: async (request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
        return apiCall<VerifyPaymentResponse>('/api/v2/payment/verify', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    /**
     * Get current user's subscription status
     */
    getStatus: async (): Promise<SubscriptionStatusResponse> => {
        return apiCall<SubscriptionStatusResponse>('/api/v2/subscription/status', {
            method: 'GET',
        });
    },
};

// ============================================
// MEDIA HISTORY API (V2)
// ============================================

export type MediaType = 'image' | 'video' | 'music';

export interface MediaMetadata {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    duration?: number;
}

export interface MediaHistoryItem {
    id: string;
    type: MediaType;
    url: string;
    thumbnailUrl: string | null;
    prompt: string;
    model: string;
    createdAt: string;
    metadata: MediaMetadata;
}

export interface MediaHistoryParams {
    type?: MediaType;
    page?: number;
    limit?: number;
}

export interface MediaHistoryResponse {
    items: MediaHistoryItem[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export const mediaApi = {
    /**
     * Get user's media history (images, videos, music)
     */
    getHistory: async (params: MediaHistoryParams = {}): Promise<MediaHistoryResponse> => {
        const searchParams = new URLSearchParams();
        if (params.type) searchParams.append('type', params.type);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());

        const query = searchParams.toString();
        return apiCall<MediaHistoryResponse>(`/api/v2/media/history${query ? `?${query}` : ''}`, {
            method: 'GET',
        });
    },

    /**
     * Delete a media item
     */
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        return apiCall<{ success: boolean; message: string }>(`/api/v2/media/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============================================
// USER API KEYS API (V2)
// ============================================

export interface ApiKeyItem {
    id: string;
    name: string;
    prefix: string;
    createdAt: string;
    lastUsed: string | null;
    usageCount: number;
}

export interface ApiKeysListResponse {
    keys: ApiKeyItem[];
    limit: number;
    remaining: number;
}

export interface CreateApiKeyRequest {
    name: string;
}

export interface CreateApiKeyResponse {
    id: string;
    name: string;
    key: string;  // Full key, shown only once!
    prefix: string;
    message: string;
}

export type UsagePeriod = 'daily' | 'monthly';

export interface UsageStats {
    chat: number;
    image: number;
    video: number;
    music: number;
    tts: number;
}

export interface ApiUsageResponse {
    period: UsagePeriod;
    date: string;
    usage: UsageStats;
    limits: UsageStats;
    percentUsed: UsageStats;
}

export const apiKeysApi = {
    /**
     * List all API keys for the user
     */
    list: async (): Promise<ApiKeysListResponse> => {
        return apiCall<ApiKeysListResponse>('/api/v2/user/api-keys', {
            method: 'GET',
        });
    },

    /**
     * Create a new API key (key shown only once!)
     */
    create: async (request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> => {
        return apiCall<CreateApiKeyResponse>('/api/v2/user/api-keys', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    /**
     * Delete an API key
     */
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        return apiCall<{ success: boolean; message: string }>(`/api/v2/user/api-keys/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get API usage statistics
     */
    getUsage: async (period: UsagePeriod = 'daily'): Promise<ApiUsageResponse> => {
        return apiCall<ApiUsageResponse>(`/api/v2/user/api-usage?period=${period}`, {
            method: 'GET',
        });
    },
};

// ============================================
// CHAT SHARING API (V2)
// ============================================

export interface CreateShareRequest {
    conversationId: string;
    expiresIn?: number;  // hours
}

export interface CreateShareResponse {
    shareId: string;
    shareUrl: string;
    expiresAt: string | null;
    isPublic: boolean;
}

export interface SharedMessage {
    role: 'user' | 'model';
    content: string;
    timestamp: string;
}

export interface SharedChatResponse {
    id: string;
    title: string;
    messages: SharedMessage[];
    messageCount: number;
    createdAt: string;
    author: {
        name: string;
        avatar: string | null;
    };
}

export const shareApi = {
    /**
     * Create a shareable link for a conversation
     */
    create: async (request: CreateShareRequest): Promise<CreateShareResponse> => {
        return apiCall<CreateShareResponse>('/api/v2/chat/share', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    /**
     * Get a shared chat (public, no auth required)
     */
    getShared: async (shareId: string): Promise<SharedChatResponse> => {
        return apiCall<SharedChatResponse>(`/api/v2/shared/${shareId}`, {
            method: 'GET',
        });
    },

    /**
     * Delete a share link
     */
    delete: async (shareId: string): Promise<{ success: boolean; message: string }> => {
        return apiCall<{ success: boolean; message: string }>(`/api/v2/chat/share/${shareId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================
// PROMPTS MARKETPLACE API (V2)
// ============================================

export type PromptCategory =
    | 'writing'
    | 'coding'
    | 'marketing'
    | 'education'
    | 'creative'
    | 'business';

export type PromptSortBy = 'popular' | 'recent' | 'rating';

export interface PromptAuthor {
    id: string;
    name: string;
    avatar: string | null;
}

export interface PromptItem {
    id: string;
    title: string;
    description: string | null;
    prompt: string;
    category: PromptCategory | null;
    author: PromptAuthor;
    uses: number;
    rating: number;
    ratingCount: number;
    isPublic: boolean;
    isSaved: boolean;
    createdAt: string;
}

export interface PromptsQueryParams {
    category?: PromptCategory;
    search?: string;
    sort?: PromptSortBy;
    page?: number;
    limit?: number;
}

export interface PromptsListResponse {
    prompts: PromptItem[];
    total: number;
    page: number;
    hasMore: boolean;
    categories: PromptCategory[];
}

export interface CreatePromptRequest {
    title: string;
    description?: string;
    prompt: string;
    category?: PromptCategory;
    isPublic?: boolean;
}

export interface UpdatePromptRequest {
    title?: string;
    description?: string;
    prompt?: string;
    category?: PromptCategory;
    isPublic?: boolean;
}

export interface UsePromptResponse {
    success: boolean;
    prompt: string;
    variables: string[];
}

export const promptsApi = {
    /**
     * Browse public prompts marketplace
     */
    browseMarketplace: async (params: PromptsQueryParams = {}): Promise<PromptsListResponse> => {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append('category', params.category);
        if (params.search) searchParams.append('search', params.search);
        if (params.sort) searchParams.append('sort', params.sort);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());

        const query = searchParams.toString();
        return apiCall<PromptsListResponse>(`/api/v2/prompts/marketplace${query ? `?${query}` : ''}`, {
            method: 'GET',
        });
    },

    /**
     * Get user's own prompts
     */
    getMyPrompts: async (params: PromptsQueryParams = {}): Promise<PromptsListResponse> => {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append('category', params.category);
        if (params.search) searchParams.append('search', params.search);
        if (params.sort) searchParams.append('sort', params.sort);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());

        const query = searchParams.toString();
        return apiCall<PromptsListResponse>(`/api/v2/prompts/mine${query ? `?${query}` : ''}`, {
            method: 'GET',
        });
    },

    /**
     * Create a new prompt
     */
    create: async (request: CreatePromptRequest): Promise<{ id: string; title: string; message: string }> => {
        return apiCall<{ id: string; title: string; message: string }>('/api/v2/prompts', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    /**
     * Update an existing prompt
     */
    update: async (id: string, request: UpdatePromptRequest): Promise<{ success: boolean; message: string }> => {
        return apiCall<{ success: boolean; message: string }>(`/api/v2/prompts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    },

    /**
     * Delete a prompt
     */
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        return apiCall<{ success: boolean; message: string }>(`/api/v2/prompts/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Toggle save/unsave a prompt
     */
    toggleSave: async (id: string): Promise<{ success: boolean; isSaved: boolean }> => {
        return apiCall<{ success: boolean; isSaved: boolean }>(`/api/v2/prompts/${id}/save`, {
            method: 'POST',
        });
    },

    /**
     * Use a prompt - records usage and returns prompt with variables
     */
    use: async (id: string): Promise<UsePromptResponse> => {
        return apiCall<UsePromptResponse>(`/api/v2/prompts/${id}/use`, {
            method: 'POST',
        });
    },
};

// ============================================
// EMAIL VERIFICATION API (V2)
// ============================================

export interface ResendVerificationRequest {
    email: string;
}

export interface ResendVerificationResponse {
    success: boolean;
    message: string;
    retryAfter: number;
}

export const emailVerificationApi = {
    /**
     * Resend verification email (rate limited - 60s)
     */
    resend: async (request: ResendVerificationRequest): Promise<ResendVerificationResponse> => {
        return apiCall<ResendVerificationResponse>('/api/v2/auth/resend-verification', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },
};
