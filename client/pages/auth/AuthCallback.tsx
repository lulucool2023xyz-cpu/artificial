import { memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/landing/LoadingSpinner";

/**
 * OAuth Callback Page
 * Handles the redirect back from OAuth providers (Google, Facebook, GitHub)
 * Exchanges the authorization code for a session
 */
const AuthCallback = memo(function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleOAuthCallback, isAuthenticated } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            // Check for error from OAuth provider (can be in query or hash)
            const errorDescription = searchParams.get('error_description');
            const errorCode = searchParams.get('error');

            if (errorDescription || errorCode) {
                setError(errorDescription || errorCode || 'Authentication failed');
                setIsProcessing(false);
                return;
            }

            // First, check for authorization code in query params (PKCE flow)
            const code = searchParams.get('code');
            if (code) {
                try {
                    const result = await handleOAuthCallback(code);
                    if (result.success) {
                        setTimeout(() => {
                            navigate('/chat', { replace: true });
                        }, 100);
                    } else {
                        setError(result.error || 'Authentication failed');
                        setIsProcessing(false);
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Authentication failed');
                    setIsProcessing(false);
                }
                return;
            }

            // Check for tokens in URL hash fragment (implicit flow)
            // Supabase returns: #access_token=xxx&refresh_token=xxx&...
            const hash = window.location.hash.substring(1); // Remove the '#'
            if (hash) {
                const hashParams = new URLSearchParams(hash);
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                const expiresAt = hashParams.get('expires_at');

                // Check for error in hash
                const hashError = hashParams.get('error_description') || hashParams.get('error');
                if (hashError) {
                    setError(hashError);
                    setIsProcessing(false);
                    return;
                }

                if (accessToken) {
                    try {
                        // Import and use the token directly
                        const { storeAuthTokens, storeUser, authApi } = await import('@/lib/api');

                        // Store the tokens
                        const expiry = expiresAt ? parseInt(expiresAt) * 1000 : Date.now() + 3600 * 1000;
                        storeAuthTokens(accessToken, refreshToken || '', expiry);

                        // Get user info using the token
                        const userResponse = await authApi.me();

                        // Detect provider from URL or default to 'google'
                        const providerFromUrl = window.location.href.includes('github') ? 'github'
                            : window.location.href.includes('facebook') ? 'facebook'
                                : 'google';

                        // Store user data
                        const userData = {
                            id: userResponse.user.id,
                            email: userResponse.user.email,
                            name: userResponse.user.name || userResponse.user.fullName || '',
                            provider: providerFromUrl as 'google' | 'facebook' | 'github',
                        };
                        storeUser(userData);

                        // Force page reload to update auth state
                        window.location.href = '/chat';
                        return;
                    } catch (err) {
                        setError(err instanceof Error ? err.message : 'Failed to complete authentication');
                        setIsProcessing(false);
                        return;
                    }
                }
            }

            // No code or token found
            setError('No authorization code or token received');
            setIsProcessing(false);
        };

        if (!isAuthenticated) {
            processCallback();
        } else {
            navigate('/chat', { replace: true });
        }
    }, [searchParams, handleOAuthCallback, navigate, isAuthenticated]);

    // Error state UI
    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-3">
                        Authentication Failed
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        {error}
                    </p>
                    <a
                        href="/auth/login"
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Return to Login
                    </a>
                </div>
            </div>
        );
    }

    // Loading state UI
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-muted-foreground">
                    {isProcessing ? 'Completing authentication...' : 'Redirecting...'}
                </p>
            </div>
        </div>
    );
});

export default AuthCallback;
