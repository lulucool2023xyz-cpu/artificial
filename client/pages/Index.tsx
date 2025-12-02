import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { BackToTop } from "@/components/landing/BackToTop";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DemoPreviewSection } from "@/components/landing/DemoPreviewSection";
import { GalleryShowcaseSection } from "@/components/landing/GalleryShowcaseSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Index = memo(function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  // Redirect to chat if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/chat", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleGetStarted = (tab: "login" | "signup" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <NavigationBar onGetStartedClick={() => handleGetStarted("login")} />
        <section id="hero" aria-label="Hero section">
          <HeroSection onGetStartedClick={() => handleGetStarted("signup")} />
        </section>
        <section id="features" aria-label="Features section">
          <FeaturesSection />
        </section>
        <section id="demo" aria-label="Demo preview section">
          <DemoPreviewSection />
        </section>
        <section id="gallery" aria-label="Gallery showcase section">
          <GalleryShowcaseSection />
        </section>
        <section id="cta" aria-label="Call to action section">
          <CTASection onGetStartedClick={() => handleGetStarted("signup")} />
        </section>
        <Footer />
        <BackToTop />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalTab}
        />
      </div>
    </PageTransition>
  );
});

export default Index;
