
export interface User {
    id: string;
    email: string;
    name?: string;
    fullName?: string;
    emailVerified?: boolean;
    avatarUrl?: string;
}

export interface AuthSession {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    token_type: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number;
    session: AuthSession;
}

export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}
