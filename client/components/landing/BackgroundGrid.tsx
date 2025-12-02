import { memo } from 'react';
import { cn } from '@/lib/utils';

interface BackgroundGridProps {
  className?: string;
  opacity?: string;
  size?: string;
}

export const BackgroundGrid = memo(function BackgroundGrid({ 
  className, 
  opacity = 'opacity-[0.02]',
  size = '100px' 
}: BackgroundGridProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', opacity, className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: `${size} ${size}`,
        }}
        aria-hidden="true"
      />
    </div>
  );
});

