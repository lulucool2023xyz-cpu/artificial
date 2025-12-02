import { Link } from 'react-router-dom';
import { BackgroundGrid } from './BackgroundGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BatikPattern } from './BatikPattern';
import { OrnamentFrame } from './OrnamentFrame';

interface CTASectionProps {
  onGetStartedClick?: () => void;
}

export function CTASection({ onGetStartedClick }: CTASectionProps) {

  return (
    <section 
      className="section-padding section-container bg-black relative overflow-hidden"
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
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
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
          <Link 
            to="/about"
            className="px-10 sm:px-14 py-4 sm:py-5 border-2 border-indonesian-gold/60 text-white font-bold font-heading text-base sm:text-lg rounded-lg hover-glow button-batik-hover focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black text-center"
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
            aria-label="Learn more about us"
          >
            Tentang Kami
          </Link>
          </div>
        </ScrollReveal>

        {/* Features list */}
        <ScrollReveal delay={0.4} duration={0.7} distance={30}>
          <OrnamentFrame variant="jawa" className="bg-gradient-to-br from-white/10 to-white/5 border border-indonesian-gold/20 rounded-2xl p-6 sm:p-10 backdrop-blur-sm" style={{
          boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05)"
        }}>
          <p className="text-sm uppercase text-gray-400 font-semibold mb-6 tracking-wider">What You'll Get</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Instant voice interaction</span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Real-time vision</span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Deep thinking mode</span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Cultural insights</span>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-indonesian-gold/20">
            <p className="text-sm text-gray-400">
              No credit card required. <span className="text-indonesian-gold/80">Get started free.</span>
            </p>
          </div>
        </OrnamentFrame>
        </ScrollReveal>
      </div>
    </section>
  );
}
