import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { BackgroundGrid } from './BackgroundGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BatikPattern } from './BatikPattern';
import { OrnamentFrame } from './OrnamentFrame';

interface CTASectionProps {
  onGetStartedClick?: () => void;
}

export const CTASection = memo(function CTASection({ onGetStartedClick }: CTASectionProps) {
  const { theme } = useTheme();

  return (
    <section 
      className="section-padding section-container bg-background relative overflow-hidden"
      aria-label="Call to action section"
    >
      {/* Background elements */}
      <BackgroundGrid opacity="opacity-[0.02]" size="100px" />
      <BatikPattern variant="parang" opacity="opacity-[0.02]" speed={35} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Main CTA */}
        <ScrollReveal delay={0.1} duration={0.7} distance={30}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 sm:mb-6 leading-tight">
            Ready to Explore
            <br />
            <span className="text-glow">the Future?</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} duration={0.7} distance={25}>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of innovators and creators who are already experiencing the next generation of AI interaction. Start your journey today.
          </p>
        </ScrollReveal>

        {/* Primary CTA Button */}
        <ScrollReveal delay={0.3} duration={0.7} distance={25}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onGetStartedClick}
            className="group px-10 sm:px-14 py-4 sm:py-5 bg-white text-black font-bold font-heading text-base sm:text-lg rounded-lg cursor-pointer button-batik-hover focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black text-center"
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
            <span className="ml-2 inline-block group-hover:translate-x-1" style={{
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }} aria-hidden="true">→</span>
          </button>
          <a
            href="/aplikasi/app-release.apk"
            download="Orenax.apk"
            className={cn(
              "inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 border-2 font-bold font-heading text-base sm:text-lg rounded-lg hover-glow button-batik-hover focus:outline-none focus:ring-2 focus:ring-offset-2 text-center",
              theme === 'dark'
                ? "border-indonesian-gold/60 text-white focus:ring-white focus:ring-offset-black"
                : "border-indonesian-gold/80 text-gray-900 focus:ring-indonesian-gold focus:ring-offset-white"
            )}
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
            aria-label="Download Android App"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4486.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4486.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.8558l-1.9973-3.4592a.416.416 0 00-.1521-.1634.4128.4128 0 00-.1906-.0462.416.416 0 00-.356.2051l-1.3892 2.4058C14.172 7.6959 12.9392 7.152 11.523 7.152s-2.649.5439-3.4995 1.3316L6.6344 6.0782a.416.416 0 00-.356-.2051.4128.4128 0 00-.1906.0462.4157.4157 0 00-.1521.1634L4.1165 9.4856a.4614.4614 0 00-.024.0516c-.019.0348-.03.0723-.0322.1107v.0069c0 .0516.016.1019.0439.1448l2.8368 4.9115a.416.416 0 00.356.2051h.0008a.4157.4157 0 00.343-.1706l2.406-4.1607c.2299-.3683.6229-.6108 1.0558-.6108s.8259.2425 1.0558.6108l2.406 4.1607a.4157.4157 0 00.343.1706h.0008a.416.416 0 00.356-.2051l2.8368-4.9115a.4614.4614 0 00.0439-.1448v-.0069c-.0022-.0384-.0132-.0759-.0322-.1106a.461.461 0 00-.024-.0516"/>
            </svg>
            <span>Download for Android</span>
          </a>
          </div>
        </ScrollReveal>

        {/* Features list */}
        <ScrollReveal delay={0.4} duration={0.7} distance={30}>
          <OrnamentFrame variant="jawa" className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-2xl p-6 sm:p-10 backdrop-blur-sm" style={{
          boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05)"
        }}>
          <p className="text-sm uppercase text-muted-foreground font-semibold mb-6 tracking-wider">What You'll Get</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-foreground">Instant voice interaction</span>
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-foreground">Real-time vision</span>
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-foreground">Deep thinking mode</span>
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-foreground">Cultural insights</span>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-indonesian-gold/20">
            <button
              onClick={() => {
                if (onGetStartedClick) {
                  onGetStartedClick();
                } else {
                  const heroSection = document.getElementById('hero');
                  if (heroSection) {
                    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="px-8 py-3 bg-indonesian-gold text-black font-bold font-heading rounded-lg hover:bg-indonesian-gold/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indonesian-gold focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Get Started Free"
            >
              Get Started Free
            </button>
          </div>
        </OrnamentFrame>
        </ScrollReveal>
      </div>
    </section>
  );
});
