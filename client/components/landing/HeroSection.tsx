import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { hyperspeedPresets } from '@/components/hyperspeed-presets';
import { BackgroundGrid } from './BackgroundGrid';
import { LoadingSpinner } from './LoadingSpinner';
import { HyperspeedFallback } from './HyperspeedFallback';
import { smoothScrollTo } from '@/utils/scroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BatikPattern } from './BatikPattern';
import { BatikParticles } from './BatikParticles';
import { WayangDecoration } from './WayangDecoration';

const Hyperspeed = lazy(() => import('@/components/Hyperspeed'));

interface HeroSectionProps {
  onGetStartedClick?: () => void;
}

export function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  const [showHyperspeed, setShowHyperspeed] = useState(false);

  useEffect(() => {
    // Delay Hyperspeed loading to improve initial page load
    const timer = setTimeout(() => {
      setShowHyperspeed(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    smoothScrollTo(id, 80);
  };

  const handleTryNow = () => {
    // Navigate to demo page
    window.location.href = '/demo';
  };

  const handleLearnMore = () => {
    scrollToSection('features');
  };

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center section-container pt-20 sm:pt-24 pb-20 relative overflow-hidden"
      aria-label="Hero section"
    >
      {/* Hyperspeed background effect with lazy loading */}
      <div className="absolute inset-0 opacity-30">
        {showHyperspeed ? (
          <Suspense fallback={<HyperspeedFallback />}>
            <ErrorBoundary fallback={<HyperspeedFallback />}>
              <Hyperspeed effectOptions={hyperspeedPresets.one} />
            </ErrorBoundary>
          </Suspense>
        ) : (
          <HyperspeedFallback />
        )}
      </div>

      {/* Background grid effect */}
      <BackgroundGrid opacity="opacity-5" size="50px" className="z-10" />
      
      {/* Indonesian cultural elements */}
      <BatikPattern variant="mega-mendung" opacity="opacity-[0.04]" speed={40} className="z-10" />
      <BatikParticles count={15} className="z-10 opacity-15" />
      <WayangDecoration variant="left" size="md" className="z-10 opacity-20" />
      <WayangDecoration variant="right" size="md" className="z-10 opacity-20" />

      <div className="relative z-20 text-center max-w-4xl mx-auto">
        {/* Eye-catching badge */}
        <ScrollReveal delay={0.1} duration={0.7} distance={20}>
        <div className="inline-block mb-6 sm:mb-8">
          <div className="px-4 py-2 border border-indonesian-gold/40 rounded-full text-xs sm:text-sm font-medium tracking-widest text-white uppercase hover-glow cursor-default transition-all relative overflow-hidden">
            <div className="absolute inset-0 batik-pattern-parang opacity-20"></div>
            <span className="relative z-10">🔮 Next Generation AI</span>
          </div>
        </div>
        </ScrollReveal>

        {/* Main headline */}
        <ScrollReveal delay={0.2} duration={0.8} distance={30}>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading tracking-tight mb-4 sm:mb-6">
          <span className="text-glow">Experience the Future</span>
          <br />
          <span className="text-white opacity-90">of AI Interaction</span>
        </h1>
        </ScrollReveal>

        {/* Subheadline */}
        <ScrollReveal delay={0.3} duration={0.7} distance={25}>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
          Voice. Vision. Intelligence. All in one.
        </p>
        </ScrollReveal>

        {/* CTA Buttons */}
        <ScrollReveal delay={0.4} duration={0.7} distance={25}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={onGetStartedClick || handleTryNow}
              className="px-8 py-3 sm:px-10 sm:py-4 bg-white text-black font-semibold font-heading text-base sm:text-lg rounded-lg hover-glow button-batik-hover focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
              style={{
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                willChange: 'transform, box-shadow',
                pointerEvents: 'auto',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              aria-label="Get Started"
            >
            Get Started
          </button>
            <button 
              onClick={handleLearnMore}
              className="px-8 py-3 sm:px-10 sm:py-4 border-2 border-indonesian-gold/60 text-white font-semibold font-heading text-base sm:text-lg rounded-lg hover-glow button-batik-hover focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              style={{
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
                willChange: 'transform',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              aria-label="Learn more about AI Platform features"
            >
            Learn More
          </button>
        </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <ScrollReveal delay={0.5} duration={0.7} distance={20}>
          <button
            onClick={() => scrollToSection('features')}
            className="mt-12 sm:mt-16 animate-bounce focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
            aria-label="Scroll to features section"
          >
            <svg className="w-6 h-6 mx-auto text-white opacity-50" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
