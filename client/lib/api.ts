/**
 * API Service Layer
 * Handles communication with backend endpoints
 */

// Base URL from environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
    includeThoughts?: boolean;
}

export interface GoogleSearchConfig {
    dynamicRetrievalConfig?: {
        mode?: 'MODE_DYNAMIC' | 'MODE_UNSPECIFIED';
        dynamicThreshold?: number;
    };
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

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
                ...request,
                stream: true,
            }),
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

