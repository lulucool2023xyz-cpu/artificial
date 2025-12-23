import { memo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Check, X, Sparkles } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

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

const SignUp = memo(function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, socialLogin, isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = (location.state as any)?.from?.pathname || "/chat";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validation
    const newErrors: typeof errors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength.score < 2) {
      newErrors.password = "Password is too weak";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Attempt signup
    const success = await signup(formData.fullName, formData.email, formData.password);

    if (success) {
      const from = (location.state as any)?.from?.pathname || "/chat";
      navigate(from, { replace: true });
    } else {
      setErrors({ email: "Sign up failed. Please try again." });
    }

    setIsLoading(false);
  };

  const handleSocialSignUp = async (provider: "google" | "facebook" | "github") => {
    setIsLoading(true);

    // Simulate OAuth flow - in production, this would open OAuth popup
    const userData = {
      email: `user${Math.random().toString(36).substring(7)}@${provider === "google" ? "gmail.com" : provider === "facebook" ? "facebook.com" : "github.com"}`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    };

    const success = await socialLogin(provider, userData);
    if (success) {
      const from = (location.state as any)?.from?.pathname || "/chat";
      navigate(from, { replace: true });
    }

    setIsLoading(false);
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

            <div className="relative z-10 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side - Illustration */}
                <div className="hidden lg:flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-indonesian-gold/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-indonesian-gold/20 to-transparent rounded-2xl p-12 border border-indonesian-gold/20 backdrop-blur-sm">
                      <Sparkles className="w-32 h-32 mx-auto text-indonesian-gold animate-pulse" />
                      <h3 className="text-2xl font-bold text-foreground mt-6 text-center font-heading">
                        Join Our Community
                      </h3>
                      <p className="text-muted-foreground text-center mt-2">
                        Start your AI journey today
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Sign Up Form */}
                <div className="w-full">
                  <OrnamentFrame variant="jawa" className="border rounded-2xl p-8 sm:p-10 backdrop-blur-sm bg-card/80">
                    <div className="mb-8">
                      <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2 text-foreground">
                        <span className="text-glow">Create Account</span>
                      </h1>
                      <p className="text-muted-foreground">
                        Sign up to get started with AI platform
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Full Name Input */}
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className={cn(
                              "w-full pl-11 pr-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground",
                              "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                              "transition-all duration-300",
                              errors.fullName ? "border-red-500 shake" : "border-white/10"
                            )}
                            placeholder="John Doe"
                            disabled={isLoading}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.fullName}</p>
                        )}
                      </div>

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
                            placeholder="Create a strong password"
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
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full transition-all duration-300",
                                    getStrengthColor()
                                  )}
                                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                />
                              </div>
                              <span className={cn(
                                "text-xs font-medium",
                                passwordStrength.score === 0 && "text-gray-400",
                                passwordStrength.score === 1 && "text-red-400",
                                passwordStrength.score === 2 && "text-yellow-400",
                                passwordStrength.score === 3 && "text-blue-400",
                                passwordStrength.score === 4 && "text-green-400"
                              )}>
                                {getStrengthText()}
                              </span>
                            </div>
                            {passwordStrength.feedback.length > 0 && (
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {passwordStrength.feedback.map((item, index) => (
                                  <li key={index} className="flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password Input */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={cn(
                              "w-full pl-11 pr-11 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground",
                              "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                              "transition-all duration-300",
                              formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword
                                ? "border-green-500"
                                : errors.confirmPassword
                                  ? "border-red-500 shake"
                                  : "border-white/10"
                            )}
                            placeholder="Confirm your password"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Toggle password visibility"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <Check className="absolute right-11 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.confirmPassword}</p>
                        )}
                      </div>

                      {/* Terms Checkbox */}
                      <div>
                        <label className="flex items-start gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className={cn(
                              "mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-indonesian-gold",
                              "focus:ring-indonesian-gold focus:ring-offset-0 cursor-pointer",
                              errors.agreeToTerms && "border-red-500"
                            )}
                            disabled={isLoading}
                          />
                          <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                            I agree to the{" "}
                            <Link to="/company/terms" className="text-indonesian-gold hover:text-white">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link to="/company/privacy" className="text-indonesian-gold hover:text-white">
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                        {errors.agreeToTerms && (
                          <p className="mt-1 text-sm text-red-400 animate-fade-in">{errors.agreeToTerms}</p>
                        )}
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
                            Creating account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-card/80 text-muted-foreground">Or sign up with</span>
                      </div>
                    </div>

                    {/* Social Sign Up */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleSocialSignUp("google")}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Sign up with Google"
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
                        onClick={() => handleSocialSignUp("facebook")}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Sign up with Facebook"
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
                        onClick={() => handleSocialSignUp("github")}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Sign up with GitHub"
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

                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        to="/auth/login"
                        className="text-indonesian-gold hover:text-white font-medium transition-colors"
                      >
                        Login
                      </Link>
                    </p>
                  </OrnamentFrame>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
});

export default SignUp;
