"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MorphingNavigationLink {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface MorphingNavigationProps {
  links: MorphingNavigationLink[];
  scrollThreshold?: number;
  enablePageBlur?: boolean;
  theme?: "dark" | "light" | "glass" | "custom";
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  initialTop?: number;
  compactTop?: number;
  animationDuration?: number;
  className?: string;
  onLinkClick?: (link: MorphingNavigationLink) => void;
  onMenuToggle?: (isOpen: boolean) => void;
  enableSmoothTransitions?: boolean;
  customHamburgerIcon?: React.ReactNode;
  disableAutoMorph?: boolean;
}

export const MorphingNavigation: React.FC<MorphingNavigationProps> = ({
  links,
  scrollThreshold = 100,
  enablePageBlur = true,
  theme = "glass",
  backgroundColor,
  textColor,
  borderColor,
  initialTop = 70,
  compactTop = 20,
  animationDuration = 0.4,
  className,
  onLinkClick,
  onMenuToggle,
  enableSmoothTransitions = true,
  customHamburgerIcon,
  disableAutoMorph = false,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getThemeStyles = useCallback(() => {
    switch (theme) {
      case "dark":
        return {
          nav: "bg-black/80 border-gray-800",
          text: "text-white",
          button: "bg-black/50 border-gray-700",
          dropdown: "bg-black/90 border-gray-800",
        };
      case "light":
        return {
          nav: "bg-white/80 border-gray-200",
          text: "text-gray-900",
          button: "bg-white/50 border-gray-300",
          dropdown: "bg-white/95 border-gray-200",
        };
      case "custom":
        return {
          nav: backgroundColor ? "" : "bg-white/5 border-white/10",
          text: textColor ? "" : "text-white",
          button: "bg-black/30 border-white/10",
          dropdown: "bg-background/95 border-border",
        };
      case "glass":
      default:
        return {
          nav: "bg-white/5 border-white/10",
          text: "text-foreground",
          button: "bg-black/30 border-white/10",
          dropdown: "bg-background/95 border-border",
        };
    }
  }, [theme, backgroundColor, textColor]);

  const themeStyles = getThemeStyles();

  useEffect(() => {
    if (disableAutoMorph && !isMobile) return;
    const handleScroll = () => {
      if (isMobile) {
        setIsSticky(true);
      } else {
        setIsSticky(window.scrollY >= scrollThreshold);
      }
    };
    // Initial check
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold, disableAutoMorph, isMobile]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const open = !isMenuOpen;
    setIsMenuOpen(open);
    onMenuToggle?.(open);
  };

  const handleLinkClick = (link: MorphingNavigationLink, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    onLinkClick?.(link);
    if (enableSmoothTransitions) {
      const target = document.querySelector(link.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const customStyles = {
    backgroundColor: theme === "custom" ? backgroundColor : undefined,
    color: theme === "custom" ? textColor : undefined,
    borderColor: theme === "custom" ? borderColor : undefined,
  };

  return (
    <>
      {/* Backdrop blur when menu is open */}
      <AnimatePresence>
        {enablePageBlur && isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Container */}
      <div
        ref={navRef}
        className={cn("fixed z-[70] left-1/2 -translate-x-1/2", className)}
        style={{
          top: isMobile ? compactTop : isSticky ? compactTop : initialTop,
        }}
      >
        {/* Main Nav Bar */}
        <motion.nav
          className={cn(
            "flex justify-center items-center backdrop-blur-xl border",
            themeStyles.nav,
            themeStyles.text
          )}
          animate={{
            height: isMobile ? 56 : isSticky ? 56 : 64,
            width: isMobile || isSticky ? 56 : 420,
            borderRadius: 9999,
          }}
          transition={{ duration: animationDuration, ease: "easeInOut" }}
          style={customStyles}
        >
          {/* Desktop Links - Visible when expanded */}
          <AnimatePresence>
            {!isMobile && !isSticky &&
              links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link, e)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="px-4 py-2 text-sm font-medium tracking-wide hover:text-[#FFD700] transition-colors"
                >
                  {link.icon && <span className="mr-2 inline-block">{link.icon}</span>}
                  {link.label}
                </motion.a>
              ))}
          </AnimatePresence>

          {/* Hamburger Button - Visible when sticky or mobile */}
          <AnimatePresence>
            {(isMobile || isSticky) && (
              <motion.button
                onClick={handleMenuToggle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "w-12 h-12 rounded-full outline-none border flex items-center justify-center cursor-pointer",
                  themeStyles.button,
                  isMenuOpen && "bg-[#FFD700]/20 border-[#FFD700]/50"
                )}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {customHamburgerIcon || (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <motion.span
                      className="block w-4 h-0.5 bg-current"
                      animate={{
                        rotate: isMenuOpen ? 45 : 0,
                        y: isMenuOpen ? 3 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.span
                      className="block w-4 h-0.5 bg-current"
                      animate={{ opacity: isMenuOpen ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.span
                      className="block w-4 h-0.5 bg-current"
                      animate={{
                        rotate: isMenuOpen ? -45 : 0,
                        y: isMenuOpen ? -3 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Dropdown Menu - Drops DOWN below the nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 mt-3 w-64 sm:w-72",
                "rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden",
                themeStyles.dropdown,
                themeStyles.text
              )}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={customStyles}
            >
              <div className="p-4 space-y-1">
                {links.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(link, e)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl",
                      "font-medium text-sm tracking-wide",
                      "hover:bg-[#FFD700]/10 hover:text-[#FFD700]",
                      "transition-all duration-200"
                    )}
                  >
                    {link.icon && (
                      <span className="w-5 h-5 flex items-center justify-center text-[#FFD700]">
                        {link.icon}
                      </span>
                    )}
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MorphingNavigation;
