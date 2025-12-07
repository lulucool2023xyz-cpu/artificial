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
            // Check for error from OAuth provider
            const errorDescription = searchParams.get('error_description');
            const errorCode = searchParams.get('error');

            if (errorDescription || errorCode) {
                setError(errorDescription || errorCode || 'Authentication failed');
                setIsProcessing(false);
                return;
            }

            // Get authorization code
            const code = searchParams.get('code');
            if (!code) {
                setError('No authorization code received');
                setIsProcessing(false);
                return;
            }

            // Exchange code for session
            try {
                const result = await handleOAuthCallback(code);

                if (result.success) {
                    // Small delay to ensure state is updated before navigation
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
