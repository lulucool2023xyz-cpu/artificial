import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X, Mail, Lock, Eye, EyeOff, User, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { validateData, loginSchema, signupSchema, sanitizeString } from "@/lib/validation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
  onAuthSuccess?: () => void; // Callback after successful auth
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push("Mix of uppercase and lowercase");

  if (/\d/.test(password)) score++;
  else feedback.push("Include numbers");

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push("Include special characters");

  return { score, feedback };
};

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const { login, signup, socialLogin, isAuthenticated } = useAuth();
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupErrors, setSignupErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const passwordStrength = calculatePasswordStrength(signupData.password);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close modal when authenticated
  // Don't auto-redirect - user should be able to browse landing while logged in
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  // Prevent body scroll when modal is open and scroll to top
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Reset form when switching tabs
  useEffect(() => {
    setLoginErrors({});
    setSignupErrors({});
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    setIsLoginLoading(true);

    // Validate with Zod
    const validation = validateData(loginSchema, loginData);

    if (!validation.success) {
      setLoginErrors(validation.errors || {});
      setIsLoginLoading(false);
      return;
    }

    // Proceed with sanitized data
    const sanitizedData = validation.data!;
    const result = await login(sanitizedData.email, sanitizedData.password);

    if (result.success) {
      // Redirect will be handled by useEffect watching isAuthenticated
    } else {
      setLoginErrors({ password: result.error || "Invalid email or password" });
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    setIsSignupLoading(true);

    // Validate with Zod
    const validation = validateData(signupSchema, signupData);

    if (!validation.success) {
      setSignupErrors(validation.errors || {});
      setIsSignupLoading(false);
      return;
    }

    // Proceed with sanitized data
    const sanitizedData = validation.data!;
    const result = await signup(
      sanitizedData.fullName,
      sanitizedData.email,
      sanitizedData.password
    );

    if (result.success) {
      // Redirect will be handled by useEffect watching isAuthenticated
    } else {
      setSignupErrors({ email: result.error || "Sign up failed. Please try again." });
      setIsSignupLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.score === 0) return "bg-gray-500";
    if (passwordStrength.score === 1) return "bg-red-500";
    if (passwordStrength.score === 2) return "bg-yellow-500";
    if (passwordStrength.score === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength.score === 0) return "Very Weak";
    if (passwordStrength.score === 1) return "Weak";
    if (passwordStrength.score === 2) return "Fair";
    if (passwordStrength.score === 3) return "Good";
    return "Strong";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    // Removed click-outside-to-close to prevent accidental closes when selecting text
    // User must click X button to close modal
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" style={{ zIndex: 99998 }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-black/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-auto"
        style={{ zIndex: 99999, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("login")}
            className={cn(
              "flex-1 px-6 py-4 text-center font-semibold transition-all",
              activeTab === "login"
                ? "text-white bg-white/5 border-b-2 border-indonesian-gold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={cn(
              "flex-1 px-6 py-4 text-center font-semibold transition-all",
              activeTab === "signup"
                ? "text-white bg-white/5 border-b-2 border-indonesian-gold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                      loginErrors.email ? "border-red-500 shake" : "border-white/10"
                    )}
                    placeholder="you@example.com"
                    disabled={isLoginLoading}
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{loginErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-11 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                      loginErrors.password ? "border-red-500 shake" : "border-white/10"
                    )}
                    placeholder="Enter your password"
                    disabled={isLoginLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{loginErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-indonesian-gold"
                  />
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <Link
                  to="/auth/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    setTimeout(() => navigate('/auth/forgot-password'), 100);
                  }}
                  className="text-sm text-indonesian-gold hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoginLoading}
                className={cn(
                  "w-full py-3 px-4 bg-white text-black font-semibold rounded-lg",
                  "hover:bg-gray-100 transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-name"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                      signupErrors.fullName ? "border-red-500 shake" : "border-white/10"
                    )}
                    placeholder="John Doe"
                    disabled={isSignupLoading}
                  />
                </div>
                {signupErrors.fullName && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{signupErrors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                      signupErrors.email ? "border-red-500 shake" : "border-white/10"
                    )}
                    placeholder="you@example.com"
                    disabled={isSignupLoading}
                  />
                </div>
                {signupErrors.email && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{signupErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-11 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                      signupErrors.password ? "border-red-500 shake" : "border-white/10"
                    )}
                    placeholder="Create a strong password"
                    disabled={isSignupLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {signupData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all duration-300", getStrengthColor())}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          passwordStrength.score === 0 && "text-gray-400",
                          passwordStrength.score === 1 && "text-red-400",
                          passwordStrength.score === 2 && "text-yellow-400",
                          passwordStrength.score === 3 && "text-blue-400",
                          passwordStrength.score === 4 && "text-green-400"
                        )}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
                {signupErrors.password && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{signupErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-11 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                      signupData.confirmPassword && signupData.password === signupData.confirmPassword && !signupErrors.confirmPassword
                        ? "border-green-500"
                        : signupErrors.confirmPassword
                          ? "border-red-500 shake"
                          : "border-white/10"
                    )}
                    placeholder="Confirm your password"
                    disabled={isSignupLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {signupData.confirmPassword && signupData.password === signupData.confirmPassword && (
                    <Check className="absolute right-11 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {signupErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{signupErrors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupData.agreeToTerms}
                    onChange={(e) => setSignupData({ ...signupData, agreeToTerms: e.target.checked })}
                    className={cn(
                      "mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-indonesian-gold",
                      signupErrors.agreeToTerms && "border-red-500"
                    )}
                    disabled={isSignupLoading}
                  />
                  <span className="text-sm text-gray-300">
                    I agree to the{" "}
                    <Link
                      to="/company/terms"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        setTimeout(() => navigate('/company/terms'), 100);
                      }}
                      className="text-indonesian-gold hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/company/privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        setTimeout(() => navigate('/company/privacy'), 100);
                      }}
                      className="text-indonesian-gold hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {signupErrors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-400 animate-fade-in">{signupErrors.agreeToTerms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSignupLoading}
                className={cn(
                  "w-full py-3 px-4 bg-white text-black font-semibold rounded-lg",
                  "hover:bg-gray-100 transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSignupLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Social Login Section - Show for both tabs */}
          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/95 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {/* Google */}
              <button
                onClick={async () => {
                  setIsSocialLoading("google");
                  const result = await socialLogin("google");
                  setIsSocialLoading(null);
                  if (!result.success) {
                    setLoginErrors({ email: result.error || "Social login failed" });
                  }
                }}
                disabled={isSocialLoading !== null}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg",
                  "hover:bg-white/5 transition-all duration-300 group cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isSocialLoading === "google" && "bg-white/5"
                )}
                aria-label="Login with Google"
                style={{ pointerEvents: isSocialLoading !== null ? 'none' : 'auto' }}
              >
                {isSocialLoading === "google" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors hidden sm:block">Google</span>
              </button>

              {/* Facebook */}
              <button
                onClick={async () => {
                  setIsSocialLoading("facebook");
                  const result = await socialLogin("facebook");
                  setIsSocialLoading(null);
                  if (!result.success) {
                    setLoginErrors({ email: result.error || "Social login failed" });
                  }
                }}
                disabled={isSocialLoading !== null}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg",
                  "hover:bg-white/5 transition-all duration-300 group cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isSocialLoading === "facebook" && "bg-white/5"
                )}
                aria-label="Login with Facebook"
                style={{ pointerEvents: isSocialLoading !== null ? 'none' : 'auto' }}
              >
                {isSocialLoading === "facebook" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors hidden sm:block">Facebook</span>
              </button>

              {/* GitHub */}
              <button
                onClick={async () => {
                  setIsSocialLoading("github");
                  const result = await socialLogin("github");
                  setIsSocialLoading(null);
                  if (!result.success) {
                    setLoginErrors({ email: result.error || "Social login failed" });
                  }
                }}
                disabled={isSocialLoading !== null}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg",
                  "hover:bg-white/5 transition-all duration-300 group cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isSocialLoading === "github" && "bg-white/5"
                )}
                aria-label="Login with GitHub"
                style={{ pointerEvents: isSocialLoading !== null ? 'none' : 'auto' }}
              >
                {isSocialLoading === "github" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors hidden sm:block">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

