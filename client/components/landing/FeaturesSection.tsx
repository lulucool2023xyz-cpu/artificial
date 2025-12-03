import { Mic, Camera, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { GlowingCards } from '@/components/ui/glowing-card';
import { BackgroundGrid } from './BackgroundGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BatikPattern } from './BatikPattern';
import { WayangDecoration } from './WayangDecoration';
import { OrnamentFrame } from './OrnamentFrame';

const features = [
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Natural speech recognition and AI-powered responses with advanced audio synthesis",
    gradient: "from-cyan-500/30 via-blue-500/25 to-cyan-500/20",
    glowColor: "#06b6d4"
  },
  {
    icon: Camera,
    title: "Live Camera Access",
    description: "Real-time face and object detection powered by cutting-edge computer vision",
    gradient: "from-purple-500/30 via-pink-500/25 to-purple-500/20",
    glowColor: "#a855f7"
  },
  {
    icon: Brain,
    title: "Deep Reasoning",
    description: "Advanced DeepThink mode for complex analysis and multi-step problem solving",
    gradient: "from-blue-500/30 via-indigo-500/25 to-blue-500/20",
    glowColor: "#3b82f6"
  },
  {
    icon: MessageSquare,
    title: "Smart Chat",
    description: "Contextual conversations with intelligent memory and adaptive responses",
    gradient: "from-pink-500/30 via-rose-500/25 to-pink-500/20",
    glowColor: "#ec4899"
  },
  {
    icon: Sparkles,
    title: "Cultural Insights",
    description: "Knowledge engine connecting global perspectives and cultural understanding",
    gradient: "from-amber-500/30 via-orange-500/25 to-amber-500/20",
    glowColor: "#f59e0b"
  }
];

import { memo } from 'react';

export const FeaturesSection = memo(function FeaturesSection() {
  return (
    <section 
      className="section-padding section-container bg-background relative overflow-hidden"
      aria-label="Features section"
    >
      {/* Background elements */}
      <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
      <BatikPattern variant="kawung" opacity="opacity-[0.02]" speed={25} />
      <WayangDecoration variant="center" size="sm" className="opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <ScrollReveal delay={0.1} duration={0.7} distance={30}>
          <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4 sm:mb-6">
              <span className="text-foreground">Intelligent Capabilities</span>
              <br />
              <span className="text-indonesian-gold/70 text-2xl sm:text-3xl md:text-4xl font-light">
                Kemampuan Cerdas
              </span>
          </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indonesian-gold/60 to-transparent mx-auto opacity-60"></div>
          <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto">
            Five powerful AI features working together to create an unprecedented platform for human-machine interaction
          </p>
        </div>
        </ScrollReveal>

        {/* Features grid */}
        <GlowingCards
          enableGlow={true}
          glowRadius={30}
          glowOpacity={0.6}
          maxWidth="100%"
          preserveLayout={true}
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 items-stretch">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal
                key={index}
                delay={0.2}
                duration={0.7}
                distance={30}
                stagger={0.1}
                index={index}
              >
              <div
                className="group relative flex flex-col h-full"
              >
                <OrnamentFrame 
                  variant="jawa" 
                  className="flex-1 flex flex-col bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-xl backdrop-blur-sm cursor-pointer group-hover:shadow-2xl focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-black"
                  style={{
                    boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05)",
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)',
                    willChange: 'transform, box-shadow, border-color',
                    minHeight: '100%',
                  } as React.CSSProperties}
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
                    role="article"
                    aria-label={`${feature.title} feature`}
                    tabIndex={0}
                  >
                  {/* Icon container */}
                  <div className="mb-4 sm:mb-6 inline-flex">
                    <div 
                      className="p-3 sm:p-4 rounded-lg border group-hover:scale-110"
                      style={{
                        backgroundColor: `${feature.glowColor}30`,
                        borderColor: `${feature.glowColor}60`,
                        boxShadow: `0 0 20px ${feature.glowColor}30`,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'transform',
                      }}
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: feature.glowColor, filter: `drop-shadow(0 0 8px ${feature.glowColor})` }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-lg sm:text-xl font-bold font-heading mb-3 group-hover:scale-105"
                    style={{ 
                      color: feature.glowColor,
                      textShadow: `0 0 20px ${feature.glowColor}40`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'transform',
                    }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground flex-1" style={{
                    transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    {feature.description}
                  </p>
                  </div>

                  {/* Bottom accent line */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 pointer-events-none rounded-b-xl"
                    style={{
                      background: `linear-gradient(to right, transparent, ${feature.glowColor}80, transparent)`,
                      boxShadow: `0 0 10px ${feature.glowColor}60`,
                      transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  ></div>
                </OrnamentFrame>

                {/* Separator line on mobile */}
                {index < features.length - 1 && (
                  <div className="md:hidden my-6 h-px bg-gradient-to-r from-transparent via-indonesian-gold/20 to-transparent"></div>
                )}
              </div>
              </ScrollReveal>
            );
          })}
        </div>
        </GlowingCards>

        {/* Bottom accent */}
        <ScrollReveal delay={0.8} duration={0.7} distance={20}>
        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-block px-6 py-2 border border-border rounded-full text-sm text-muted-foreground opacity-70 hover-glow cursor-default">
            All features working in perfect harmony
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
});
