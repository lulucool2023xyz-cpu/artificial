import { memo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Login = memo(function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, socialLogin, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = (location.state as any)?.from?.pathname || "/chat";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validation
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Attempt login
    const success = await login(formData.email, formData.password);
    
    if (success) {
      // Wait a bit for state to update, then redirect
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname || "/chat";
        navigate(from, { replace: true });
      }, 100);
    } else {
      setErrors({ password: "Invalid email or password" });
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "github") => {
    setIsLoading(true);
    
    // Simulate OAuth flow - in production, this would open OAuth popup
    const userData = {
      email: `user${Math.random().toString(36).substring(7)}@${provider === "google" ? "gmail.com" : provider === "facebook" ? "facebook.com" : "github.com"}`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    };
    
    const success = await socialLogin(provider, userData);
    if (success) {
      // Wait a bit for state to update, then redirect
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname || "/chat";
        navigate(from, { replace: true });
      }, 100);
    } else {
      setIsLoading(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar />
        <div className="pt-16 sm:pt-20 pb-20">
          <section className="section-container section-padding relative overflow-hidden">
            <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
            <BatikPattern variant="parang" opacity="opacity-[0.02]" speed={30} />
            
            <div className="relative z-10 max-w-md mx-auto">
              {/* Login Form */}
              <div className="w-full">
                  <OrnamentFrame variant="jawa" className="border rounded-2xl p-8 sm:p-10 backdrop-blur-sm bg-card/80">
                    <div className="mb-8">
                      <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2 text-foreground">
                        <span className="text-glow">Login</span>
                      </h1>
                      <p className="text-muted-foreground">
                        Sign in to your account to continue
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Email Input */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={cn(
                              "w-full pl-11 pr-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground",
                              "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                              "transition-all duration-300",
                              errors.email ? "border-red-500 shake" : "border-white/10"
                            )}
                            placeholder="you@example.com"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.email}</p>
                        )}
                      </div>

                      {/* Password Input */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={cn(
                              "w-full pl-11 pr-11 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground",
                              "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                              "transition-all duration-300",
                              errors.password ? "border-red-500 shake" : "border-white/10"
                            )}
                            placeholder="Enter your password"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.password}</p>
                        )}
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-indonesian-gold focus:ring-indonesian-gold focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                            Remember me
                          </span>
                        </label>
                        <Link
                          to="/auth/forgot-password"
                          className="text-sm text-indonesian-gold hover:text-white transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "w-full py-3 px-4 bg-white text-black font-semibold rounded-lg",
                          "hover:bg-gray-100 transition-all duration-300",
                          "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:ring-offset-2 focus:ring-offset-black",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "transform hover:scale-[1.02] active:scale-[0.98]"
                        )}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            Logging in...
                          </span>
                        ) : (
                          "Login"
                        )}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-card/80 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleSocialLogin("google")}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Login with Google"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                      >
                        {isLoading ? (
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
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors hidden sm:block">Google</span>
                      </button>
                      <button
                        onClick={() => handleSocialLogin("facebook")}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Login with Facebook"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        )}
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors hidden sm:block">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleSocialLogin("github")}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Login with GitHub"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        )}
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors hidden sm:block">GitHub</span>
                      </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        to="/auth/signup"
                        className="text-indonesian-gold hover:text-white font-medium transition-colors"
                      >
                        Sign up
                      </Link>
                    </p>

                    {/* Privacy Policy & Terms Links */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-center text-xs text-gray-500">
                        By continuing, you agree to our{" "}
                        <Link
                          to="/company/terms"
                          className="text-indonesian-gold hover:text-white transition-colors underline"
                        >
                          Terms of Service
                        </Link>
                        {" "}and{" "}
                        <Link
                          to="/company/privacy"
                          className="text-indonesian-gold hover:text-white transition-colors underline"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </OrnamentFrame>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
});

export default Login;
