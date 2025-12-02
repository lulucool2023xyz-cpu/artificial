import { Brain, Globe, Users } from 'lucide-react';
import { GlowingCards } from '@/components/ui/glowing-card';
import { BackgroundGrid } from './BackgroundGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BatikPattern } from './BatikPattern';
import { IndonesianQuote } from './IndonesianQuote';
import { OrnamentFrame } from './OrnamentFrame';

export function AboutSection() {
  return (
    <section 
      className="section-padding section-container bg-black relative overflow-hidden"
      aria-label="About section"
    >
      {/* Background elements */}
      <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
      <BatikPattern variant="parang" opacity="opacity-[0.03]" speed={30} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <ScrollReveal delay={0.1} duration={0.7} distance={30}>
          <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6">
              <span className="text-white">A New Era of AI Innovation</span>
              <br />
              <span className="text-indonesian-gold/80 text-2xl sm:text-3xl md:text-4xl font-light">
                Era Baru Inovasi AI
              </span>
          </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indonesian-gold/60 to-transparent mx-auto opacity-60"></div>
        </div>
        </ScrollReveal>

        {/* Vision statements in grid */}
        <GlowingCards
          enableGlow={true}
          glowRadius={30}
          glowOpacity={0.7}
          maxWidth="100%"
          preserveLayout={true}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <ScrollReveal delay={0.2} duration={0.7} distance={30} stagger={0.1} index={0}>
            <div className="flex flex-col h-full">
            <OrnamentFrame 
              variant="jawa" 
              className="flex-1 flex flex-col bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl backdrop-blur-sm group cursor-default focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-black"
              style={{
                boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05)",
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
                willChange: 'transform, box-shadow, border-color',
                minHeight: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = "inset 0 0 40px rgba(255, 255, 255, 0.08), 0 0 30px rgba(217, 119, 6, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = "inset 0 0 30px rgba(255, 255, 255, 0.05)";
              }}
            >
              <div 
                className="flex-1 flex flex-col p-6 sm:p-8"
              >
              <div 
                className="w-12 h-12 rounded-lg border flex items-center justify-center mb-4" 
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.25)",
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'scale(1)',
                  willChange: 'transform',
                }}
                aria-hidden="true"
              >
                <Brain className="w-6 h-6" style={{ color: "#3b82f6" }} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3" style={{ color: "#60a5fa" }}>Intelligence</h3>
              <p className="text-gray-300 leading-relaxed flex-1">
                Advanced reasoning capabilities that understand context, nuance, and complexity with unprecedented depth.
              </p>
            </div>
            </OrnamentFrame>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} duration={0.7} distance={30} stagger={0.1} index={1}>
            <div className="flex flex-col h-full">
            <OrnamentFrame 
              variant="jawa" 
              className="flex-1 flex flex-col bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl backdrop-blur-sm group cursor-default focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-black"
              style={{
                boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05)",
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
                willChange: 'transform, box-shadow, border-color',
                minHeight: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = "inset 0 0 40px rgba(255, 255, 255, 0.08), 0 0 30px rgba(217, 119, 6, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = "inset 0 0 30px rgba(255, 255, 255, 0.05)";
              }}
            >
              <div 
                className="flex-1 flex flex-col p-6 sm:p-8"
              >
              <div 
                className="w-12 h-12 rounded-lg border flex items-center justify-center mb-4" 
                style={{
                  backgroundColor: "rgba(6, 182, 212, 0.25)",
                  borderColor: "rgba(6, 182, 212, 0.5)",
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'scale(1)',
                  willChange: 'transform',
                }}
                aria-hidden="true"
              >
                <Globe className="w-6 h-6" style={{ color: "#06b6d4" }} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3" style={{ color: "#22d3ee" }}>Knowledge</h3>
              <p className="text-gray-300 leading-relaxed flex-1">
                Comprehensive understanding across domains with real-time access to global information and insights.
              </p>
            </div>
            </OrnamentFrame>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} duration={0.7} distance={30} stagger={0.1} index={2}>
            <div className="flex flex-col h-full">
            <OrnamentFrame 
              variant="jawa" 
              className="flex-1 flex flex-col bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl backdrop-blur-sm group cursor-default focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-black"
              style={{
                boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05)",
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
                willChange: 'transform, box-shadow, border-color',
                minHeight: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = "inset 0 0 40px rgba(255, 255, 255, 0.08), 0 0 30px rgba(217, 119, 6, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = "inset 0 0 30px rgba(255, 255, 255, 0.05)";
              }}
            >
              <div 
                className="flex-1 flex flex-col p-6 sm:p-8"
              >
              <div 
                className="w-12 h-12 rounded-lg border flex items-center justify-center mb-4" 
                style={{
                  backgroundColor: "rgba(168, 85, 247, 0.25)",
                  borderColor: "rgba(168, 85, 247, 0.5)",
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'scale(1)',
                  willChange: 'transform',
                }}
                aria-hidden="true"
              >
                <Users className="w-6 h-6" style={{ color: "#a855f7" }} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3" style={{ color: "#c084fc" }}>Connection</h3>
              <p className="text-gray-300 leading-relaxed flex-1">
                Bridging cultures and perspectives through AI-powered understanding and meaningful human connections.
              </p>
            </div>
            </OrnamentFrame>
            </div>
          </ScrollReveal>
          </div>
        </GlowingCards>

        {/* Main vision text */}
        <GlowingCards
          enableGlow={true}
          glowRadius={40}
          glowOpacity={0.7}
          maxWidth="100%"
          preserveLayout={true}
        >
        <ScrollReveal delay={0.5} duration={0.7} distance={30}>
          <OrnamentFrame 
            variant="jawa" 
            className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-2xl backdrop-blur-sm group"
            style={{
              boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05)",
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
              willChange: 'transform, box-shadow, border-color',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = "inset 0 0 50px rgba(255, 255, 255, 0.08), 0 0 40px rgba(217, 119, 6, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = "inset 0 0 30px rgba(255, 255, 255, 0.05)";
            }}
          >
            <div 
              className="p-8 sm:p-12"
            >
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-6">
              We believe AI should transcend traditional boundaries. Our platform integrates multiple modalities—voice, vision, reasoning, chat, and cultural knowledge—into a cohesive system that truly understands human needs.
            </p>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
              By combining cutting-edge technology with intuitive design, we're creating an AI assistant that doesn't just respond—it understands, learns, and grows with you. This is the future of human-AI interaction.
            </p>
            
            {/* Stats */}
            <div className="mt-8 pt-8 border-t border-violet-500/30 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: "#a78bfa" }}>5</div>
                <div className="text-xs sm:text-sm text-gray-300 mt-2">AI Capabilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: "#a78bfa" }}>∞</div>
                <div className="text-xs sm:text-sm text-gray-300 mt-2">Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: "#a78bfa" }}>24/7</div>
                <div className="text-xs sm:text-sm text-gray-300 mt-2">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: "#a78bfa" }}>1</div>
                <div className="text-xs sm:text-sm text-gray-300 mt-2">Future</div>
              </div>
            </div>
          </div>
          </OrnamentFrame>
        </ScrollReveal>
        </GlowingCards>

        {/* Cultural Quote Section */}
        <div className="mt-20 sm:mt-32">
          <IndonesianQuote quoteId="wisdom" delay={0.3} />
        </div>
      </div>
    </section>
  );
}
