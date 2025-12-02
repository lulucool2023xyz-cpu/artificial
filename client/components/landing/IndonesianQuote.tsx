import { memo } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { cn } from '@/lib/utils';

interface IndonesianQuoteProps {
  quoteId?: 'wisdom' | 'unity' | 'progress' | 'heritage';
  delay?: number;
  className?: string;
}

const quotes = {
  wisdom: {
    indonesian: 'Kearifan lokal adalah jembatan antara masa lalu dan masa depan.',
    english: 'Local wisdom is the bridge between the past and the future.',
    author: 'Pepatah Tradisional',
  },
  unity: {
    indonesian: 'Bhinneka Tunggal Ika - Berbeda-beda tetapi tetap satu jua.',
    english: 'Unity in Diversity - Different but still one.',
    author: 'Motto Nasional Indonesia',
  },
  progress: {
    indonesian: 'Maju tak gentar, membela yang benar.',
    english: 'Forward without fear, defending what is right.',
    author: 'Pepatah Nusantara',
  },
  heritage: {
    indonesian: 'Melestarikan budaya bukan berarti menolak kemajuan, tetapi merangkul keduanya dengan harmonis.',
    english: 'Preserving culture does not mean rejecting progress, but embracing both harmoniously.',
    author: 'Filsafat Modern',
  },
};

export const IndonesianQuote = memo(function IndonesianQuote({
  quoteId = 'wisdom',
  delay = 0.2,
  className,
}: IndonesianQuoteProps) {
  const quote = quotes[quoteId];

  return (
    <ScrollReveal delay={delay} duration={0.8} distance={20}>
      <div className={cn('text-center max-w-3xl mx-auto', className)}>
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#D97706]/40 to-transparent" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#D97706]/40 to-transparent" />
          
          {/* Quote content */}
          <blockquote className="px-8 py-6">
            <p className="text-lg sm:text-xl text-[#D97706]/90 font-light italic mb-3 leading-relaxed">
              "{quote.indonesian}"
            </p>
            <p className="text-sm sm:text-base text-gray-400 mb-2">
              {quote.english}
            </p>
            <footer className="text-xs text-gray-500 mt-4">
              — {quote.author}
            </footer>
          </blockquote>
        </div>
      </div>
    </ScrollReveal>
  );
});

