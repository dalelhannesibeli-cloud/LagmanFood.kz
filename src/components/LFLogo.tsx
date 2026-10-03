import React from 'react';

interface LFLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const LFLogo: React.FC<LFLogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const dimensions = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Monogram Crest */}
      <div
        className={`${dimensions} rounded-lg bg-gradient-to-br from-[#1c1a16] to-[#0c0c0e] border border-[#d4af37]/40 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-[#d4af37] transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 via-transparent to-transparent opacity-60" />
        <span className="font-serif font-bold tracking-tighter text-gold-gradient relative z-10 select-none">
          LF
        </span>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#d4af37]/20 rounded-full blur-[2px]" />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-lg font-semibold tracking-wider text-white group-hover:text-[#fef08a] transition-colors leading-none">
            LAGMAN FOOD
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-medium mt-1">
            HAUTE CUISINE · 18+
          </span>
        </div>
      )}
    </div>
  );
};
