import { authApi } from '../lib/api';
import type {
    AuthResponse,
    User,
    AuthSession
} from '../types/auth';

// Define types locally if not present in types/auth
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response: any = await authApi.register(data);
        return this.adaptToAuthResponse(response);
    }

    /**
     * Login with email and password
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response: any = await authApi.login(data);
        return this.adaptToAuthResponse(response);
    }

    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<{ user: User }> {
        // authApi.me returns { user: ... }
        const response: any = await authApi.me();
        return { user: response.user as User };
    }

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        try {
            await authApi.logout();
        } catch (error) {
            console.warn('Logout API error:', error);
        } finally {
            this.clearTokens();
        }
    }

    /**
     * Request password reset email
     */
    async forgotPassword(email: string, redirectTo?: string): Promise<void> {
        await authApi.forgotPassword(email, redirectTo);
    }

    /**
     * Update password with reset token
     */
    async updatePassword(accessToken: string, newPassword: string): Promise<void> {
        await authApi.updatePassword(accessToken, newPassword);
    }

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<AuthResponse> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response: any = await authApi.refresh(refreshToken);

        // Handle refresh response which might just contain session
        const sessionData = response.session || response;

        // Construct partial response if user is missing (common in refresh)
        const user = this.getStoredUser() || { id: '', email: '', name: 'User' };

        const authResponse: AuthResponse = {
            message: 'Session refreshed',
            user: user as User,
            accessToken: sessionData.access_token || sessionData.accessToken,
            refreshToken: sessionData.refresh_token || sessionData.refreshToken,
            expiresIn: sessionData.expires_in || 3600,
            expiresAt: sessionData.expires_at || Date.now() + 3600000,
            session: {
                access_token: sessionData.access_token || sessionData.accessToken,
                refresh_token: sessionData.refresh_token || sessionData.refreshToken,
                expires_in: sessionData.expires_in || 3600,
                expires_at: sessionData.expires_at || Date.now() + 3600000,
                token_type: 'bearer'
            }
        };

        this.saveTokens(authResponse);
        return authResponse;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    /**
     * Get stored access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    // Adapt API response to AuthResponse
    private adaptToAuthResponse(apiResponse: any): AuthResponse {
        const accessToken = apiResponse.accessToken || apiResponse.session?.access_token;
        const refreshToken = apiResponse.refreshToken || apiResponse.session?.refresh_token;
        const expiresIn = apiResponse.expiresIn || apiResponse.session?.expires_in || 3600;
        const expiresAt = apiResponse.expiresAt || apiResponse.session?.expires_at || (Date.now() + expiresIn * 1000);

        const authResponse: AuthResponse = {
            message: apiResponse.message || 'Success',
            user: apiResponse.user as User,
            accessToken,
            refreshToken,
            expiresIn,
            expiresAt,
            session: apiResponse.session || {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: expiresIn,
                expires_at: expiresAt,
                token_type: 'bearer'
            }
        };

        this.saveTokens(authResponse);
        return authResponse;
    }

    // Private methods
    private saveTokens(data: AuthResponse): void {
        if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    }

    private clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    private getStoredUser(): User | null {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    }
}

export const authService = new AuthService();
