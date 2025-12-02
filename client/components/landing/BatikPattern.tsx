import { memo } from 'react';
import { cn } from '@/lib/utils';

interface BatikPatternProps {
  variant?: 'parang' | 'kawung' | 'mega-mendung' | 'ceplok';
  opacity?: string;
  className?: string;
  speed?: number;
}

export const BatikPattern = memo(function BatikPattern({
  variant = 'parang',
  opacity = 'opacity-10',
  className,
  speed = 30,
}: BatikPatternProps) {
  const patterns = {
    parang: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 20px,
        rgba(217, 119, 6, 0.03) 20px,
        rgba(217, 119, 6, 0.03) 40px
      )`,
      backgroundSize: '80px 80px',
    },
    kawung: {
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.02) 3px, transparent 3px),
        radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.02) 3px, transparent 3px)
      `,
      backgroundSize: '60px 60px',
    },
    'mega-mendung': {
      backgroundImage: `
        radial-gradient(ellipse at 30% 30%, rgba(59, 130, 246, 0.02) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 70%, rgba(139, 69, 19, 0.02) 0%, transparent 50%)
      `,
      backgroundSize: '120px 120px',
    },
    ceplok: {
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(217, 119, 6, 0.02) 15px, rgba(217, 119, 6, 0.02) 30px),
        repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(139, 69, 19, 0.02) 15px, rgba(139, 69, 19, 0.02) 30px)
      `,
      backgroundSize: '50px 50px',
    },
  };

  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', opacity, className)}
      style={{
        ...patterns[variant],
        animation: `batik-float ${speed}s ease-in-out infinite`,
      }}
      aria-hidden="true"
    />
  );
});

