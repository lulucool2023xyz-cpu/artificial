import { memo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BatikParticlesProps {
  count?: number;
  className?: string;
}

export const BatikParticles = memo(function BatikParticles({
  count = 20,
  className,
}: BatikParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles (rice grains or jasmine flowers)
    const particles: Array<{
      element: HTMLDivElement;
      x: number;
      y: number;
      speed: number;
      size: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2; // 2-6px
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const speed = Math.random() * 0.5 + 0.2; // 0.2-0.7

      particle.style.position = 'absolute';
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = '50%';
      particle.style.background = 'radial-gradient(circle, rgba(217, 119, 6, 0.3), rgba(139, 69, 19, 0.1))';
      particle.style.pointerEvents = 'none';
      particle.style.animation = `batik-particle ${10 + Math.random() * 20}s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(particle);
      particles.push({ element: particle, x, y, speed, size });
    }

    return () => {
      particles.forEach(({ element }) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
      aria-hidden="true"
    />
  );
});

