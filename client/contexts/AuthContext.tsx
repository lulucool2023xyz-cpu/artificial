import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { handleError, AppError } from "@/lib/errorHandler";
import {
  authApi,
  storeAuthTokens,
  storeUser,
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  getStoredUser
} from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  provider?: "google" | "facebook" | "github" | "email";
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  socialLogin: (provider: "google" | "facebook" | "github", userData: { email: string; name: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants for token management
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Schedule token refresh before expiry
  const scheduleTokenRefresh = useCallback((expiresAt: number) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const refreshTime = expiresAt - Date.now() - TOKEN_EXPIRY_BUFFER;
    if (refreshTime > 0) {
      refreshTimerRef.current = setTimeout(() => {
        refreshSession();
      }, refreshTime);
    }
  }, []);

  // Refresh session with refresh token
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;

      const response = await authApi.refresh(refreshToken);

      if (response.session) {
        const { access_token, refresh_token, expires_at } = response.session;
        storeAuthTokens(access_token, refresh_token, expires_at);
        setAccessToken(access_token);
        scheduleTokenRefresh(expires_at * 1000); // Convert to ms
        return true;
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      handleError(
        new AppError(
          "Failed to refresh session",
          "Your session has expired. Please log in again.",
          { component: "AuthProvider", action: "refreshSession" }
        )
      );
      logout();
    }
    return false;
  }, [scheduleTokenRefresh]);

  // Logout function
  const logout = useCallback(async () => {
    // Clear timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Try to call backend logout (fire and forget)
    try {
      await authApi.logout();
    } catch {
      // Ignore errors - we're logging out anyway
    }

    // Clear state
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);

    // Clear storage
    clearAuthData();
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = getAccessToken();
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          // Verify token with backend
          try {
            const response = await authApi.me();
            setUser({
              id: response.user.id,
              email: response.user.email,
              name: response.user.name || response.user.fullName || '',
              provider: 'email',
            });
            setAccessToken(storedToken);
            setIsAuthenticated(true);
          } catch {
            // Token invalid, try refresh
            const refreshed = await refreshSession();
            if (!refreshed) {
              clearAuthData();
            }
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        handleError(
          new AppError(
            "Authentication check failed",
            "Unable to verify your login status",
            { component: "AuthProvider", action: "checkAuth" }
          )
        );
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [refreshSession]);

  // Login with email and password
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        return { success: false, error: "Email and password are required" };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }

      // Call backend API
      const response = await authApi.login({ email, password });

      // Store tokens
      const expiresAt = response.expiresAt || (Date.now() + 24 * 60 * 60 * 1000);
      storeAuthTokens(response.accessToken, response.refreshToken, expiresAt);

      // Store user
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name || response.user.fullName || email.split("@")[0],
        provider: "email",
      };
      storeUser(userData);

      // Update state
      setIsAuthenticated(true);
      setUser(userData);
      setAccessToken(response.accessToken);
      scheduleTokenRefresh(expiresAt);

      return { success: true };
    } catch (error) {
      // Better error messages for common errors
      let errorMessage = "Login gagal";
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("invalid") || msg.includes("password") || msg.includes("credentials")) {
          errorMessage = "Email atau password salah";
        } else if (msg.includes("not found") || msg.includes("user")) {
          errorMessage = "Akun tidak ditemukan";
        } else if (msg.includes("network") || msg.includes("fetch")) {
          errorMessage = "Tidak dapat terhubung ke server";
        } else {
          errorMessage = error.message;
        }
      }
      console.error("Login error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user
  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Input validation
      if (!name || !email || !password) {
        return { success: false, error: "All fields are required" };
      }

      if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: "Invalid email format" };
      }

      // Call backend API
      const response = await authApi.register({ email, password, name });

      // Store tokens
      const expiresAt = response.expiresAt || (Date.now() + 24 * 60 * 60 * 1000);
      storeAuthTokens(response.accessToken, response.refreshToken, expiresAt);

      // Store user
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name || response.user.fullName || name,
        provider: "email",
      };
      storeUser(userData);

      // Update state
      setIsAuthenticated(true);
      setUser(userData);
      setAccessToken(response.accessToken);
      scheduleTokenRefresh(expiresAt);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      console.error("Signup error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Social login (placeholder - needs OAuth implementation)
  const socialLogin = async (
    provider: "google" | "facebook" | "github",
    userData: { email: string; name: string }
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // TODO: Implement OAuth flow via backend
      // For now, show message that OAuth is not yet implemented
      return {
        success: false,
        error: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon. Please use email/password.`
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Social login failed";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        login,
        signup,
        socialLogin,
        logout,
        isLoading,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
