import { memo } from 'react';
import { cn } from '@/lib/utils';

interface WayangDecorationProps {
  variant?: 'left' | 'right' | 'center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WayangDecoration = memo(function WayangDecoration({
  variant = 'center',
  size = 'md',
  className,
}: WayangDecorationProps) {
  const sizes = {
    sm: 'w-24 h-32',
    md: 'w-32 h-40',
    lg: 'w-40 h-52',
  };

  const positions = {
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  const transforms = {
    left: 'scaleX(-1)',
    right: 'scaleX(1)',
    center: 'scaleX(1)',
  };

  return (
    <div
      className={cn('absolute pointer-events-none', positions[variant], sizes[size], className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 250"
        className="w-full h-full"
        style={{
          transform: transforms[variant],
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
        }}
      >
        {/* Modernized wayang silhouette - simplified and elegant */}
        <defs>
          <linearGradient id="wayang-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 69, 19, 0.3)" />
            <stop offset="50%" stopColor="rgba(217, 119, 6, 0.2)" />
            <stop offset="100%" stopColor="rgba(139, 69, 19, 0.3)" />
          </linearGradient>
        </defs>
        
        {/* Head */}
        <ellipse cx="100" cy="40" rx="35" ry="45" fill="url(#wayang-gradient)" />
        
        {/* Crown/Headpiece */}
        <path
          d="M 70 25 Q 100 15 130 25 Q 120 10 100 10 Q 80 10 70 25 Z"
          fill="rgba(217, 119, 6, 0.25)"
        />
        
        {/* Body */}
        <path
          d="M 80 85 Q 100 120 120 85 L 110 180 Q 100 200 90 180 Z"
          fill="url(#wayang-gradient)"
        />
        
        {/* Arms - left */}
        <path
          d="M 80 100 Q 50 110 40 130 Q 35 120 40 110 Q 50 100 60 95 Z"
          fill="url(#wayang-gradient)"
        />
        
        {/* Arms - right */}
        <path
          d="M 120 100 Q 150 110 160 130 Q 165 120 160 110 Q 150 100 140 95 Z"
          fill="url(#wayang-gradient)"
        />
        
        {/* Decorative lines */}
        <path
          d="M 100 50 Q 85 60 75 70 M 100 50 Q 115 60 125 70"
          stroke="rgba(217, 119, 6, 0.2)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
});

