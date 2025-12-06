import { memo, useState } from "react";
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

  // Note: We no longer auto-redirect authenticated users to chat
  // Users should be able to view the landing page even when logged in

  const handleGetStarted = (tab: "login" | "signup" = "login") => {
    // If user is already authenticated, go directly to chat instead of opening modal
    if (isAuthenticated && !isLoading) {
      navigate("/chat");
      return;
    }
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
        <section id="intelligent-capabilities" aria-label="Intelligent Capabilities section">
          <FeaturesSection />
        </section>
        <section id="set-in-action" aria-label="Set in Action section">
          <DemoPreviewSection />
        </section>
        <section id="visual-showcase" aria-label="Visual Showcase section">
          <GalleryShowcaseSection />
        </section>
        <section id="ready-to-explore" aria-label="Ready to Explore section">
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
