import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { BackgroundGrid } from './BackgroundGrid';
import { smoothScrollTo } from '@/utils/scroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { theme } = useTheme();

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
      className={cn(
        "border-t relative overflow-hidden",
        theme === 'dark'
          ? "bg-black border-white/10"
          : "bg-white border-gray-200"
      )}
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
              <h3 className={cn(
                "text-xl sm:text-2xl font-bold font-heading mb-3",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                Orenax
              </h3>
              <p className={cn(
                "text-sm sm:text-base mb-4",
                theme === 'dark' ? "text-gray-400" : "text-gray-600"
              )}>
                The next generation of AI interaction. Combining voice, vision, reasoning, and cultural knowledge.
              </p>
              <p className={cn(
                "text-xs sm:text-sm",
                theme === 'dark' ? "text-gray-500" : "text-gray-500"
              )}>
                © {currentYear} Orenax. All rights reserved.
              </p>
            </div>
          </ScrollReveal>

          {/* Navigation links */}
          <ScrollReveal delay={0.2} duration={0.7} distance={25} stagger={0.05} index={0}>
            <div>
              <h4 className={cn(
                "font-semibold font-heading mb-4 text-sm uppercase tracking-wider",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>Navigation</h4>
              <ul className="space-y-2 text-sm" role="list">
                <li>
                  <Link 
                    to="/"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Navigate to home"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/product/demo"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Navigate to product demo"
                  >
                    Product
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/research"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Navigate to research"
                  >
                    Research
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/about"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Navigate to company"
                  >
                    Company
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Resources links */}
          <ScrollReveal delay={0.2} duration={0.7} distance={25} stagger={0.05} index={1}>
            <div>
              <h4 className={cn(
                "font-semibold font-heading mb-4 text-sm uppercase tracking-wider",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>Resources</h4>
              <ul className="space-y-2 text-sm" role="list">
                <li>
                  <Link 
                    to="/resources/documentation"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="View documentation"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/resources/status"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="View status and changelog"
                  >
                    Status & Changelog
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/resources/blog"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Read blog"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:hello@orenax.com"
                    className={cn(
                      "focus:outline-none focus:ring-2 rounded transition-colors",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Contact support"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Legal links */}
          <ScrollReveal delay={0.2} duration={0.7} distance={25} stagger={0.05} index={2}>
            <div>
              <h4 className={cn(
                "font-semibold font-heading mb-4 text-sm uppercase tracking-wider",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>Legal</h4>
              <ul className="space-y-2 text-sm" role="list">
                <li>
                  <Link 
                    to="/company/privacy"
                    className={cn(
                      "transition-colors focus:outline-none focus:ring-2 rounded",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Privacy policy"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/terms"
                    className={cn(
                      "transition-colors focus:outline-none focus:ring-2 rounded",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Terms of service"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/privacy"
                    className={cn(
                      "transition-colors focus:outline-none focus:ring-2 rounded",
                      theme === 'dark'
                        ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                        : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                    )}
                    aria-label="Cookie policy"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Social links */}
          <ScrollReveal delay={0.2} duration={0.7} distance={25} stagger={0.05} index={3}>
            <div>
              <h4 className={cn(
                "font-semibold font-heading mb-4 text-sm uppercase tracking-wider",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>Connect</h4>
              <div className="flex gap-4" role="list">
                <a 
                  href="https://twitter.com/orenax"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center hover:text-glow focus:outline-none focus:ring-2 transition-all",
                    theme === 'dark'
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 focus:ring-white focus:ring-offset-black"
                      : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 focus:ring-gray-900 focus:ring-offset-white"
                  )}
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
                  href="https://github.com/orenax"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center hover:text-glow focus:outline-none focus:ring-2 transition-all",
                    theme === 'dark'
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 focus:ring-white focus:ring-offset-black"
                      : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 focus:ring-gray-900 focus:ring-offset-white"
                  )}
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
                  href="https://linkedin.com/company/orenax"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center hover:text-glow focus:outline-none focus:ring-2 transition-all",
                    theme === 'dark'
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 focus:ring-white focus:ring-offset-black"
                      : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 focus:ring-gray-900 focus:ring-offset-white"
                  )}
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
                  href="mailto:hello@orenax.com"
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center hover:text-glow focus:outline-none focus:ring-2 transition-all",
                    theme === 'dark'
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 focus:ring-white focus:ring-offset-black"
                      : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 focus:ring-gray-900 focus:ring-offset-white"
                  )}
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
          <div className={cn(
            "border-t pt-8 sm:pt-12",
            theme === 'dark' ? "border-white/10" : "border-gray-200"
          )}>
            {/* Bottom info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className={cn(
                "text-center sm:text-left text-sm",
                theme === 'dark' ? "text-gray-500" : "text-gray-500"
              )}>
                Crafted with precision for the future of AI interaction.
              </p>
              <div className="flex gap-6 text-sm" role="list">
                <Link 
                  to="/resources/status" 
                  className={cn(
                    "transition-colors focus:outline-none focus:ring-2 rounded",
                    theme === 'dark'
                      ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                      : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                  )}
                  aria-label="System status"
                >
                  Status
                </Link>
                <Link 
                  to="/resources/documentation" 
                  className={cn(
                    "transition-colors focus:outline-none focus:ring-2 rounded",
                    theme === 'dark'
                      ? "text-gray-400 hover:text-white focus:ring-white focus:ring-offset-black"
                      : "text-gray-600 hover:text-gray-900 focus:ring-gray-900 focus:ring-offset-white"
                  )}
                  aria-label="View documentation"
                >
                  Documentation
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
