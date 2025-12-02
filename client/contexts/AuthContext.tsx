import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { handleError, AppError } from "@/lib/errorHandler";

interface User {
  id: string;
  email: string;
  name: string;
  provider?: "google" | "facebook" | "github" | "email";
  avatar?: string;
}

interface AuthToken {
  token: string;
  expiresAt: number;
  refreshToken: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  socialLogin: (provider: "google" | "facebook" | "github", userData: { email: string; name: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants for token management
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

// Utility functions for secure token management
const generateToken = (userId: string, expiresInHours: number = 24): AuthToken => {
  // Simulate JWT token generation (in production, this comes from backend)
  const token = btoa(JSON.stringify({ userId, iat: Date.now(), exp: Date.now() + expiresInHours * 60 * 60 * 1000 }));
  const refreshToken = btoa(JSON.stringify({ userId, type: "refresh", iat: Date.now() }));
  
  return {
    token,
    expiresAt: Date.now() + expiresInHours * 60 * 60 * 1000,
    refreshToken,
  };
};

const isTokenValid = (tokenData: AuthToken | null): boolean => {
  if (!tokenData) return false;
  return Date.now() < tokenData.expiresAt - TOKEN_EXPIRY_BUFFER;
};

const getStoredToken = (): AuthToken | null => {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    const expiresAt = sessionStorage.getItem(`${TOKEN_KEY}_expires`);
    
    if (token && refreshToken && expiresAt) {
      return {
        token,
        refreshToken,
        expiresAt: parseInt(expiresAt, 10),
      };
    }
  } catch (error) {
    const errorMessage = "Error reading stored token";
    console.error(errorMessage, error);
    handleError(error, { component: "AuthProvider", action: "getStoredToken" });
  }
  return null;
};

const storeToken = (tokenData: AuthToken): void => {
  try {
    sessionStorage.setItem(TOKEN_KEY, tokenData.token);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);
    sessionStorage.setItem(`${TOKEN_KEY}_expires`, tokenData.expiresAt.toString());
  } catch (error) {
    console.error("Error storing token:", error);
    handleError(error, { component: "AuthProvider", action: "storeToken" });
  }
};

const clearStoredAuth = (): void => {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(`${TOKEN_KEY}_expires`);
    sessionStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error clearing stored auth:", error);
    handleError(error, { component: "AuthProvider", action: "clearStoredAuth" });
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh token before expiry
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
      const storedToken = getStoredToken();
      if (!storedToken) return false;

      // Simulate API call to refresh token
      await new Promise((resolve) => setTimeout(resolve, 500));

      const storedUser = sessionStorage.getItem(USER_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const newToken = generateToken(userData.id);
        storeToken(newToken);
        scheduleTokenRefresh(newToken.expiresAt);
        return true;
      }
    } catch (error) {
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

  // Check authentication on mount and validate token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = sessionStorage.getItem(USER_KEY);

        if (storedToken && storedUser && isTokenValid(storedToken)) {
          const userData = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUser(userData);
          scheduleTokenRefresh(storedToken.expiresAt);
        } else if (storedToken && !isTokenValid(storedToken)) {
          // Try to refresh if token expired
          const refreshed = await refreshSession();
          if (!refreshed) {
            clearStoredAuth();
          }
        } else {
          clearStoredAuth();
        }
      } catch (error) {
        handleError(
          new AppError(
            "Authentication check failed",
            "Unable to verify your login status",
            { component: "AuthProvider", action: "checkAuth" }
          )
        );
        clearStoredAuth();
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
  }, [refreshSession, scheduleTokenRefresh]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with validation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password) {
        return { success: false, error: "Email and password are required" };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }

      // For demo purposes, accept any valid email/password
      // In production, this would be an actual API call
      const userId = btoa(email); // Generate simple user ID
      const userData: User = {
        id: userId,
        email,
        name: email.split("@")[0],
        provider: "email",
      };
      
      // Generate and store token
      const token = generateToken(userId);
      storeToken(token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      scheduleTokenRefresh(token.expiresAt);
      
      return { success: true };
    } catch (error) {
      const appError = new AppError(
        error instanceof Error ? error.message : "Login failed",
        "An error occurred during login. Please try again.",
        { component: "AuthProvider", action: "login", additionalData: { email } }
      );
      handleError(appError);
      return { success: false, error: appError.userMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with validation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
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

      // For demo purposes, accept any valid signup
      const userId = btoa(email);
      const userData: User = {
        id: userId,
        email,
        name,
        provider: "email",
      };
      
      // Generate and store token
      const token = generateToken(userId);
      storeToken(token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      scheduleTokenRefresh(token.expiresAt);
      
      return { success: true };
    } catch (error) {
      const appError = new AppError(
        error instanceof Error ? error.message : "Signup failed",
        "An error occurred during signup. Please try again.",
        { component: "AuthProvider", action: "signup", additionalData: { email } }
      );
      handleError(appError);
      return { success: false, error: appError.userMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: "google" | "facebook" | "github", userData: { email: string; name: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call for social login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (!userData.email || !userData.name) {
        return { success: false, error: "Invalid social login data" };
      }

      // In production, this would verify the OAuth token with the provider
      const userId = btoa(userData.email);
      const userDataWithProvider: User = {
        id: userId,
        ...userData,
        provider,
      };
      
      // Generate and store token
      const token = generateToken(userId);
      storeToken(token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(userDataWithProvider));
      
      setIsAuthenticated(true);
      setUser(userDataWithProvider);
      scheduleTokenRefresh(token.expiresAt);
      
      return { success: true };
    } catch (error) {
      const appError = new AppError(
        error instanceof Error ? error.message : "Social login failed",
        "An error occurred during social login. Please try again.",
        { component: "AuthProvider", action: "socialLogin", additionalData: { provider } }
      );
      handleError(appError);
      return { success: false, error: appError.userMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    // Clear timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Clear state
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear storage
    clearStoredAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
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

