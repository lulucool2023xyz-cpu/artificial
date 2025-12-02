import { memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface OrnamentFrameProps {
  children: ReactNode;
  variant?: 'jawa' | 'bali' | 'toraja';
  className?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const OrnamentFrame = memo(function OrnamentFrame({
  children,
  variant = 'jawa',
  className,
  onMouseEnter,
  onMouseLeave,
}: OrnamentFrameProps) {
  const ornaments = {
    jawa: (
      <>
        {/* Top corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D97706]/30 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D97706]/30 rounded-tr-lg" />
        {/* Bottom corners */}
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D97706]/30 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D97706]/30 rounded-br-lg" />
        {/* Decorative dots */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#D97706]/40 rounded-full" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#D97706]/40 rounded-full" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-[#D97706]/40 rounded-full" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-[#D97706]/40 rounded-full" />
      </>
    ),
    bali: (
      <>
        {/* Balinese geometric patterns */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#D97706]/40 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#D97706]/40 to-transparent" />
        {/* Side decorations */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-[#D97706]/40 to-transparent" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-[#D97706]/40 to-transparent" />
      </>
    ),
    toraja: (
      <>
        {/* Toraja geometric patterns - simplified */}
        <div className="absolute inset-0 border border-[#D97706]/20 rounded-lg">
          <div className="absolute top-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-[#D97706]/30 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-[#D97706]/30 to-transparent" />
          <div className="absolute top-2 bottom-2 left-2 w-px bg-gradient-to-b from-transparent via-[#D97706]/30 to-transparent" />
          <div className="absolute top-2 bottom-2 right-2 w-px bg-gradient-to-b from-transparent via-[#D97706]/30 to-transparent" />
        </div>
      </>
    ),
  };

  return (
    <div 
      className={cn('relative', className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {ornaments[variant]}
      {children}
    </div>
  );
});

