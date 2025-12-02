import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { BackgroundGrid } from './BackgroundGrid';
import { smoothScrollTo } from '@/utils/scroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      window.location.href = `/#${id}`;
    } else {
      smoothScrollTo(id, 80);
    }
  };

  return (
    <footer 
      className="bg-black border-t border-white/10 relative overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background grid */}
      <BackgroundGrid opacity="opacity-[0.02]" size="100px" />

      <div className="relative z-10 section-container py-12 sm:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand section */}
          <ScrollReveal delay={0.1} duration={0.7} distance={25}>
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mb-3">
                AI Platform
              </h3>
              <p className="text-gray-400 text-sm sm:text-base mb-4">
                The next generation of AI interaction. Combining voice, vision, reasoning, and cultural knowledge.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                © {currentYear} AI Platform. All rights reserved.
              </p>
            </div>
          </ScrollReveal>

          {/* Product links */}
          <ScrollReveal delay={0.2} duration={0.7} distance={25} stagger={0.05} index={0}>
            <div>
              <h4 className="text-white font-semibold font-heading mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm" role="list">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    style={{
                      transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    aria-label="Navigate to features section"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <Link 
                    to="/demo"
                    className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    style={{
                      transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    aria-label="Navigate to demo page"
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about"
                    className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    style={{
                      transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    aria-label="Navigate to about page"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('cta')}
                    className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    style={{
                      transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    aria-label="Navigate to CTA section"
                  >
                    Get Started
                  </button>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Company links */}
          <ScrollReveal delay={0.2} duration={0.7} distance={25} stagger={0.05} index={1}>
            <div>
              <h4 className="text-white font-semibold font-heading mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm" role="list">
                <li>
                  <Link 
                    to="/company/about"
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    aria-label="About us"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/careers"
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    aria-label="View careers"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/privacy"
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    aria-label="Privacy policy"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/terms"
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    aria-label="Terms of service"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Social links */}
          <ScrollReveal delay={0.2} duration={0.7} distance={25} stagger={0.05} index={2}>
            <div>
              <h4 className="text-white font-semibold font-heading mb-4 text-sm uppercase tracking-wider">Connect</h4>
              <div className="flex gap-4" role="list">
                <a 
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 hover:text-glow focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  style={{
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)',
                    willChange: 'transform, background-color, border-color',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 hover:text-glow focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  style={{
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)',
                    willChange: 'transform, background-color, border-color',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="View our GitHub"
                >
                  <Github className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 hover:text-glow focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  style={{
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)',
                    willChange: 'transform, background-color, border-color',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Connect on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="mailto:contact@aiplatform.com"
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 hover:text-glow focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  style={{
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)',
                    willChange: 'transform, background-color, border-color',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Send us an email"
                >
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Divider */}
        <ScrollReveal delay={0.3} duration={0.7} distance={20}>
          <div className="border-t border-white/10 pt-8 sm:pt-12">
            {/* Bottom info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-center sm:text-left text-sm text-gray-500">
                Crafted with precision for the future of AI interaction.
              </p>
              <div className="flex gap-6 text-sm" role="list">
                <a href="#status" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded" aria-label="System status">Status</a>
                <a href="#changelog" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded" aria-label="View changelog">Changelog</a>
                <a href="#docs" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded" aria-label="View documentation">Documentation</a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
