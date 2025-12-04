"use client";

import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverEffect?: boolean;
}

export interface GlowingCardsProps {
  children: React.ReactNode;
  className?: string;
  /** Enable the glowing overlay effect */
  enableGlow?: boolean;
  /** Size of the glow effect radius */
  glowRadius?: number;
  /** Opacity of the glow effect */
  glowOpacity?: number;
  /** Animation duration for glow transitions */
  animationDuration?: number;
  /** Enable hover effects on individual cards */
  enableHover?: boolean;
  /** Gap between cards */
  gap?: string;
  /** Maximum width of cards container */
  maxWidth?: string;
  /** Padding around the container */
  padding?: string;
  /** Background color for the container */
  backgroundColor?: string;
  /** Border radius for cards */
  borderRadius?: string;
  /** Enable responsive layout */
  responsive?: boolean;
  /** Preserve children layout (don't force flex layout) */
  preserveLayout?: boolean;
  /** Custom CSS variables for theming */
  customTheme?: {
    cardBg?: string;
    cardBorder?: string;
    textColor?: string;
    hoverBg?: string;
  };
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className,
  glowColor = "#3b82f6",
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex-1 min-w-[14rem] p-6 rounded-2xl text-black dark:text-white",
        "bg-background border ",
        "transition-all duration-400 ease-out",
        className
      )}
      style={{
        '--glow-color': glowColor, // CSS variable definition
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};

export const GlowingCards: React.FC<GlowingCardsProps> = ({
  children,
  className,
  enableGlow = true,
  glowRadius = 25,
  glowOpacity = 1,
  animationDuration = 400,
  enableHover = true,
  gap = "2.5rem",
  maxWidth = "75rem",
  padding = "3rem 1.5rem",
  backgroundColor,
  borderRadius = "1rem",
  responsive = true,
  preserveLayout = false,
  customTheme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay || !enableGlow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      setShowOverlay(true);
      // Using string concatenation for style properties
      overlay.style.setProperty('--x', x + 'px');
      overlay.style.setProperty('--y', y + 'px');
      overlay.style.setProperty('--opacity', glowOpacity.toString());
    };

    const handleMouseLeave = () => {
      setShowOverlay(false);
      overlay.style.setProperty('--opacity', '0');
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableGlow, glowOpacity]);

  const containerStyle = {
    '--gap': gap,
    '--max-width': maxWidth,
    '--padding': padding,
    '--border-radius': borderRadius,
    '--animation-duration': animationDuration + 'ms', // Concatenation
    '--glow-radius': glowRadius + 'rem', // Concatenation
    '--glow-opacity': glowOpacity,
    backgroundColor: backgroundColor || undefined,
    ...customTheme,
  } as React.CSSProperties;

  return (
    <div
      className={cn("relative w-full", className)}
      style={containerStyle}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative max-w-[var(--max-width)] mx-auto ",
          preserveLayout ? "" : "px-6 py-2"
        )}
        style={preserveLayout ? {} : { padding: "var(--padding)" }} // String literal
      >
        <div
          className={cn(
            preserveLayout ? "" : "flex items-center justify-center flex-wrap gap-[var(--gap)]",
            preserveLayout ? "" : responsive && "flex-col sm:flex-row "
          )}
        >
          {children}
        </div>
        {enableGlow && (
          <div
            ref={overlayRef}
            className={cn(
              "absolute inset-0 pointer-events-none select-none",
              "opacity-0 transition-all ease-out"
            )}
            style={{
              // String concatenation for WebkitMask and mask
              WebkitMask:
                "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
              mask:
                "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
              opacity: showOverlay ? 'var(--opacity)' : '0',
              transitionDuration: 'var(--animation-duration)',
            }}
          >
            <div
              className={cn(
                preserveLayout ? "" : "flex items-center justify-center flex-wrap gap-[var(--gap)] max-w-[var(--max-width)] center mx-auto",
                preserveLayout ? "" : responsive && "flex-col sm:flex-row"
              )}
              style={preserveLayout ? {} : { padding: "var(--padding)" }} // String literal
            >
              {preserveLayout ? (
                React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    // Recursively clone children to add glow styling to nested cards
                    const cloneWithGlow = (element: React.ReactElement): React.ReactElement => {
                      const hasCardClass = element.props?.className?.includes('bg-gradient-to-br') || 
                                          element.props?.className?.includes('rounded-xl') ||
                                          element.props?.className?.includes('rounded-2xl');
                      
                      if (hasCardClass && element.props.children) {
                        // Extract glow color from element's style if available, otherwise use vibrant colors
                        const existingGlowColor = element.props.style?.['--glow-color'] as string;
                        const glowColor = existingGlowColor || element.props.style?.borderColor as string;
                        
                        // Generate vibrant colors based on element position or use existing color
                        const colors = [
                          { bg: "rgba(59, 130, 246, 0.3)", border: "rgba(59, 130, 246, 0.7)", shadow: "0 0 30px rgba(59, 130, 246, 0.5), inset 0 0 30px rgba(59, 130, 246, 0.2)" }, // Blue
                          { bg: "rgba(168, 85, 247, 0.3)", border: "rgba(168, 85, 247, 0.7)", shadow: "0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 30px rgba(168, 85, 247, 0.2)" }, // Purple
                          { bg: "rgba(236, 72, 153, 0.3)", border: "rgba(236, 72, 153, 0.7)", shadow: "0 0 30px rgba(236, 72, 153, 0.5), inset 0 0 30px rgba(236, 72, 153, 0.2)" }, // Pink
                          { bg: "rgba(34, 197, 94, 0.3)", border: "rgba(34, 197, 94, 0.7)", shadow: "0 0 30px rgba(34, 197, 94, 0.5), inset 0 0 30px rgba(34, 197, 94, 0.2)" }, // Green
                          { bg: "rgba(251, 146, 60, 0.3)", border: "rgba(251, 146, 60, 0.7)", shadow: "0 0 30px rgba(251, 146, 60, 0.5), inset 0 0 30px rgba(251, 146, 60, 0.2)" }, // Orange
                          { bg: "rgba(6, 182, 212, 0.3)", border: "rgba(6, 182, 212, 0.7)", shadow: "0 0 30px rgba(6, 182, 212, 0.5), inset 0 0 30px rgba(6, 182, 212, 0.2)" }, // Cyan
                        ];
                        const colorIndex = Math.abs(element.key?.toString().charCodeAt(0) || 0) % colors.length;
                        const selectedColor = colors[colorIndex];
                        
                        // Use existing glow color if available, otherwise use selected color
                        let finalColor = selectedColor;
                        if (glowColor) {
                          // Try to extract color from CSS variable or hex/rgb
                          if (typeof glowColor === 'string') {
                            // If it's a hex color, convert to rgba
                            if (glowColor.startsWith('#')) {
                              const hex = glowColor.replace('#', '');
                              const r = parseInt(hex.substring(0, 2), 16);
                              const g = parseInt(hex.substring(2, 4), 16);
                              const b = parseInt(hex.substring(4, 6), 16);
                              finalColor = {
                                bg: `rgba(${r}, ${g}, ${b}, 0.35)`,
                                border: `rgba(${r}, ${g}, ${b}, 0.75)`,
                                shadow: `0 0 35px rgba(${r}, ${g}, ${b}, 0.6), inset 0 0 35px rgba(${r}, ${g}, ${b}, 0.25)`
                              };
                            } else if (glowColor.includes('rgba')) {
                              // Extract RGB values from existing color
                              const rgbMatch = glowColor.match(/\d+/g);
                              if (rgbMatch && rgbMatch.length >= 3) {
                                const r = parseInt(rgbMatch[0]);
                                const g = parseInt(rgbMatch[1]);
                                const b = parseInt(rgbMatch[2]);
                                finalColor = {
                                  bg: `rgba(${r}, ${g}, ${b}, 0.35)`,
                                  border: `rgba(${r}, ${g}, ${b}, 0.75)`,
                                  shadow: `0 0 35px rgba(${r}, ${g}, ${b}, 0.6), inset 0 0 35px rgba(${r}, ${g}, ${b}, 0.25)`
                                };
                              }
                            }
                          }
                        }
                        
                        return React.cloneElement(element, {
                          ...element.props,
                          style: {
                            ...element.props.style,
                            backgroundColor: finalColor.bg,
                            borderColor: finalColor.border,
                            boxShadow: finalColor.shadow,
                          },
                          children: React.Children.map(element.props.children, (child) => {
                            if (React.isValidElement(child)) {
                              return cloneWithGlow(child);
                            }
                            return child;
                          }),
                        });
                      }
                      
                      if (element.props.children) {
                        return React.cloneElement(element, {
                          ...element.props,
                          children: React.Children.map(element.props.children, (child) => {
                            if (React.isValidElement(child)) {
                              return cloneWithGlow(child);
                            }
                            return child;
                          }),
                        });
                      }
                      
                      return element;
                    };
                    
                    return cloneWithGlow(child as React.ReactElement);
                  }
                  return child;
                })
              ) : (
                React.Children.map(children, (child, index) => {
                  if (React.isValidElement(child) && child.type === GlowingCard) {
                    const cardGlowColor = child.props.glowColor || "#3b82f6";
                    return React.cloneElement(child as React.ReactElement<any>, {
                      className: cn(
                        child.props.className,
                        "bg-opacity-15 dark:bg-opacity-15",
                        "border-opacity-100 dark:border-opacity-100"
                      ),
                      style: {
                        ...child.props.style,
                        // String concatenation for background, border, and boxShadow
                        backgroundColor: cardGlowColor + "15",
                        borderColor: cardGlowColor,
                        boxShadow: "0 0 0 1px inset " + cardGlowColor,
                      },
                    });
                  }
                  return child;
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { GlowingCards as default };

