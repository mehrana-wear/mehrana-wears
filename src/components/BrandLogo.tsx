import React from 'react';

const LOGO_SRC = './assets/aistudio/WhatsApp_Image_2026-11-25_at_01.24.40_6db6318f.jpeg';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      img: 'w-9 h-9',
      title: 'text-lg',
      subtitle: 'text-[8px]',
      gap: 'gap-2',
    },
    md: {
      img: 'w-9 h-9 sm:w-12 sm:h-12',
      title: 'text-base sm:text-[26px]',
      subtitle: 'text-[7px] sm:text-[9px]',
      gap: 'gap-2 sm:gap-3',
    },
    lg: {
      img: 'w-16 h-16',
      title: 'text-3xl',
      subtitle: 'text-[10px]',
      gap: 'gap-3.5',
    },
    xl: {
      img: 'w-24 h-24',
      title: 'text-4xl',
      subtitle: 'text-xs',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Brand Emblem Image */}
      <div 
        className={`${currentSize.img} rounded-xl overflow-hidden shrink-0 shadow-xs border border-[#8A9A5B]/30 bg-[#FAF6EE] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center p-0.5`}
      >
        <img
          src={LOGO_SRC}
          alt="Mehrana wear official logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* Brand Typographic Identity */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span 
            className={`font-serif font-bold tracking-tight leading-none ${
              variant === 'light' 
                ? 'text-[#FDFBF7]' 
                : variant === 'dark' 
                ? 'text-[#2D2D2D]' 
                : 'text-[#2D2D2D] dark:text-[#FDFBF7]'
            } ${currentSize.title}`}
          >
            Mehrana <span className="font-normal lowercase text-[#8A9A5B]">wear</span>
          </span>
          <span className={`${currentSize.subtitle} tracking-[0.14em] sm:tracking-[0.22em] font-semibold text-[#8A9A5B] uppercase block mt-0.5 sm:mt-1 whitespace-nowrap`}>
            Kaftan & Luxury Pret
          </span>
        </div>
      )}
    </div>
  );
};
