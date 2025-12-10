import { useState, useRef, useEffect, memo, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  /** Fallback image if main image fails to load */
  fallbackSrc?: string;
  /** Show a blur placeholder while loading */
  showPlaceholder?: boolean;
  /** Placeholder blur color */
  placeholderColor?: string;
  /** Enable native lazy loading */
  lazy?: boolean;
  /** Custom wrapper className */
  wrapperClassName?: string;
  /** Called when image loads successfully */
  onLoadComplete?: () => void;
  /** Called when image fails to load */
  onLoadError?: () => void;
  /** Enable fade-in animation */
  fadeIn?: boolean;
  /** Aspect ratio for placeholder (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string;
}

/**
 * OptimizedImage - Performance-optimized image component
 * Features:
 * - Native lazy loading
 * - Async decoding
 * - Fade-in animation
 * - Blur placeholder
 * - Error handling with fallback
 * - IntersectionObserver for true lazy loading
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  showPlaceholder = true,
  placeholderColor = 'bg-muted/50',
  lazy = true,
  wrapperClassName,
  className,
  onLoadComplete,
  onLoadError,
  fadeIn = true,
  aspectRatio,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    onLoadError?.();
  };

  const imageSrc = hasError ? fallbackSrc : src;

  // Generate WebP source if the original is jpg/jpeg/png
  const getWebPSrc = (originalSrc: string) => {
    if (!originalSrc) return null;
    const ext = originalSrc.split('.').pop()?.toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return null;
  };

  const webpSrc = getWebPSrc(imageSrc);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative overflow-hidden',
        wrapperClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder */}
      {showPlaceholder && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse',
            placeholderColor
          )}
          aria-hidden="true"
        />
      )}

      {/* Image - only render when in view */}
      {isInView && (
        <picture>
          {/* WebP source if available */}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover',
              fadeIn && 'transition-opacity duration-500',
              fadeIn && !isLoaded && 'opacity-0',
              fadeIn && isLoaded && 'opacity-100',
              className
            )}
            {...props}
          />
        </picture>
      )}
    </div>
  );
});

/**
 * BackgroundOptimizedImage - For use with background-image style
 * Returns a div with optimized background image loading
 */
interface BackgroundOptimizedImageProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
  lazy?: boolean;
  placeholderColor?: string;
}

export const BackgroundOptimizedImage = memo(function BackgroundOptimizedImage({
  src,
  className,
  children,
  lazy = true,
  placeholderColor = 'bg-muted/50',
}: BackgroundOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const ref = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // Preload image when in view
  useEffect(() => {
    if (!isInView || isLoaded) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [isInView, src, isLoaded]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-500',
        !isLoaded && placeholderColor,
        className
      )}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
});

export default OptimizedImage;

