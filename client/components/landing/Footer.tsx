import { memo, useMemo, useCallback } from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { BackgroundGrid } from './BackgroundGrid';
import { smoothScrollTo } from '@/utils/scroll';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const Footer = memo(function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const location = useLocation();
  const { theme } = useTheme();

  const scrollToSection = useCallback((id: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      window.location.href = `/#${id}`;
    } else {
      smoothScrollTo(id, 80);
    }
  }, [location.pathname]);

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
                    href="mailto:arieffajarmarhas@gmail.com"
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
                  href="https://instagram.com/marhasupdate"
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
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
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
                  href="mailto:arieffajarmarhas@gmail.com"
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
});
