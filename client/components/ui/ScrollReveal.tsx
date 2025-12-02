import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  index?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  distance = 30,
  stagger = 0,
  index = 0,
  direction = 'up',
  threshold = 0.1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');

  // Check for reduced motion preference - use state to trigger re-render
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirectionRef.current = currentScrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasBeenVisible(true);
          } else {
            // Animate out when scrolling up and element has been visible
            if (hasBeenVisible && scrollDirectionRef.current === 'up') {
              setIsVisible(false);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px', // Trigger when element is 50px from bottom of viewport
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, hasBeenVisible]);

  // Calculate transform based on direction and visibility
  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `translateY(${distance}px)`;
        case 'down':
          return `translateY(-${distance}px)`;
        case 'left':
          return `translateX(${distance}px)`;
        case 'right':
          return `translateX(-${distance}px)`;
        default:
          return `translateY(${distance}px)`;
      }
    }
    return 'translateY(0) translateX(0)';
  };

  // Calculate total delay (base delay + stagger * index)
  const totalDelay = delay + stagger * index;

  // If reduced motion is preferred, show immediately without animation
  const shouldAnimate = !prefersReducedMotion;
  const finalDuration = shouldAnimate ? duration : 0.01;
  const finalDelay = shouldAnimate ? (isVisible ? totalDelay : 0) : 0;
  const finalTransform = shouldAnimate ? getTransform() : 'translateY(0) translateX(0)';
  const finalOpacity = shouldAnimate ? (isVisible ? 1 : 0) : 1;

  return (
    <div
      ref={elementRef}
      className={cn('transition-all ease-out', className)}
      style={{
        opacity: finalOpacity,
        transform: finalTransform,
        transitionDuration: `${finalDuration}s`,
        transitionDelay: `${finalDelay}s`,
        transitionProperty: 'opacity, transform',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

