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
import { ScrollTimeline, TimelineEvent } from "@/components/ui/ScrollTimeline";
import { ClipboardList, Users, Award, Trophy } from "lucide-react";

// Timeline data untuk kompetisi
const competitionTimelineEvents: TimelineEvent[] = [
  {
    id: "registration",
    year: "24 Nov - 14 Des 2025",
    title: "Pendaftaran Peserta Hackathon",
    subtitle: "Tahap Awal",
    description: "Pendaftaran pada form hanya sebatas idea dan identitas kelompok. Siapkan konsep terbaik Anda!",
    icon: <ClipboardList className="h-4 w-4 text-[#FFD700]" />,
  },
  {
    id: "mentoring",
    year: "14 - 17 Des 2025",
    title: "Mentoring Online",
    subtitle: "Tahap Pengembangan",
    description: "Pendampingan dari ide menjadi sebuah prototyping (aplikasi, system automasi, chatbot, dan sejenisnya). PPT dikirim melalui mentor dan atau link form.",
    icon: <Users className="h-4 w-4 text-[#FFD700]" />,
  },
  {
    id: "judging",
    year: "18 - 21 Des 2025",
    title: "Penilaian - Kurasi Submit 10 Prototyping",
    subtitle: "Tahap Seleksi",
    description: "Team kurator Juri akan memilih juara dari 10 prototyping terpilih, melalui zoom meet. Tunjukkan karya terbaik Anda!",
    icon: <Award className="h-4 w-4 text-[#FFD700]" />,
  },
  {
    id: "announcement",
    year: "22 Des 2025",
    title: "Pengumuman Hasil",
    subtitle: "Grand Finale",
    description: "Pengumuman juara 1, 2, 3 - harapan 1, 2 - unique inovasi, pilihan publik. Pemenang juara 1 akan mewakili presentasi di closing acara.",
    icon: <Trophy className="h-4 w-4 text-[#FFD700]" />,
  },
];

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
        <section id="competition-timeline" aria-label="Timeline Kompetisi section">
          <ScrollTimeline
            events={competitionTimelineEvents}
            title="Timeline Kompetisi"
            subtitle="Jadwal lengkap kompetisi dari pendaftaran hingga pengumuman pemenang"
            cardAlignment="alternating"
            cardVariant="outlined"
            cardEffect="glow"
            revealAnimation="slide"
            progressIndicator={true}
            progressLineWidth={3}
          />
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
