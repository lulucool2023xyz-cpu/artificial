import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Footer } from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { BatikPattern } from "@/components/landing/BatikPattern";
import { OrnamentFrame } from "@/components/landing/OrnamentFrame";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api";

const ForgotPassword = memo(function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }

    setIsLoading(true);

    try {
      // Call the real forgot password API
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      await authApi.forgotPassword(email, redirectUrl);
      setIsSuccess(true);
    } catch (err) {
      // Don't show specific error for security (don't reveal if email exists)
      // Still show success for security reasons
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <NavigationBar />
          <div className="pt-16 sm:pt-20 pb-20">
            <section className="section-container section-padding relative overflow-hidden">
              <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
              <BatikPattern variant="parang" opacity="opacity-[0.02]" speed={30} />

              <div className="relative z-10 max-w-2xl mx-auto">
                <OrnamentFrame variant="jawa" className="border rounded-2xl p-8 sm:p-12 backdrop-blur-sm bg-card/80 text-center">
                  <div className="mb-6 animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4 text-foreground">
                      <span className="text-glow">Check Your Email</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2">
                      We've sent a password reset link to
                    </p>
                    <p className="text-lg font-semibold text-indonesian-gold mb-8">
                      {email}
                    </p>
                    <p className="text-muted-foreground mb-8">
                      Please check your inbox and click on the reset link to create a new password.
                      The link will expire in 1 hour.
                    </p>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Didn't receive the email? Check your spam folder or{" "}
                        <button
                          onClick={() => setIsSuccess(false)}
                          className="text-indonesian-gold hover:text-white transition-colors"
                        >
                          try again
                        </button>
                      </p>
                      <Link
                        to="/auth/login"
                        className="inline-flex items-center gap-2 text-indonesian-gold hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                      </Link>
                    </div>
                  </div>
                </OrnamentFrame>
              </div>
            </section>
          </div>
          <Footer />
        </div>
      </PageTransition>
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
                      <Mail className="w-32 h-32 mx-auto text-indonesian-gold animate-pulse" />
                      <h3 className="text-2xl font-bold text-foreground mt-6 text-center font-heading">
                        Reset Your Password
                      </h3>
                      <p className="text-muted-foreground text-center mt-2">
                        We'll help you get back into your account
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full">
                  <OrnamentFrame variant="jawa" className="border rounded-2xl p-8 sm:p-10 backdrop-blur-sm bg-card/80">
                    <div className="mb-8">
                      <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2 text-foreground">
                        <span className="text-glow">Reset Password</span>
                      </h1>
                      <p className="text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
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
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError("");
                            }}
                            className={cn(
                              "w-full pl-11 pr-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground",
                              "focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:border-transparent",
                              "transition-all duration-300",
                              error ? "border-red-500 shake" : "border-white/10"
                            )}
                            placeholder="you@example.com"
                            disabled={isLoading}
                          />
                        </div>
                        {error && (
                          <p className="mt-1 text-sm text-red-400 animate-fade-in">{error}</p>
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
                            Sending reset link...
                          </span>
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                      <Link
                        to="/auth/login"
                        className="inline-flex items-center gap-2 text-sm text-indonesian-gold hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                      </Link>
                    </div>
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

export default ForgotPassword;
