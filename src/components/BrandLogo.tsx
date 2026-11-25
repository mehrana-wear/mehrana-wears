import React from 'react';

const LOGO_SRC = './assets/logo-bold.png';

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
      img: 'w-10 h-10',
      title: 'text-lg',
      subtitle: 'text-[8px]',
      gap: 'gap-2',
    },
    md: {
      img: 'w-11 h-11 sm:w-14 sm:h-14',
      title: 'text-lg sm:text-[28px]',
      subtitle: 'text-[8px] sm:text-[10px]',
      gap: 'gap-2.5 sm:gap-3.5',
    },
    lg: {
      img: 'w-20 h-20',
      title: 'text-3xl',
      subtitle: 'text-[10px]',
      gap: 'gap-3.5',
    },
    xl: {
      img: 'w-28 h-28',
      title: 'text-4xl',
      subtitle: 'text-xs',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size];

  const isLightText = variant === 'light';

  return (
    <div className={`flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Brand Emblem Image */}
      <div 
        className={`${currentSize.img} rounded-xl overflow-hidden shrink-0 shadow-sm border ${
          isLightText ? 'border-[#C5D1A5]/40' : 'border-[#2D3B26]/25'
        } bg-[#FAF6EE] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}
      >
        <img
          src={LOGO_SRC}
          alt="Mehrana wear official logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typographic Identity */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span 
            className={`font-serif font-bold tracking-tight leading-none ${
              isLightText
                ? 'text-[#FDFBF7]' 
                : variant === 'dark' 
                ? 'text-[#1E1E1E]' 
                : 'text-[#1E1E1E] dark:text-[#FDFBF7]'
            } ${currentSize.title}`}
          >
            Mehrana{' '}
            <span
              className={`font-medium lowercase ${
                isLightText ? 'text-[#C5D1A5]' : 'text-[#4F602F]'
              }`}
            >
              wear
            </span>
          </span>
          <span
            className={`${currentSize.subtitle} tracking-[0.14em] sm:tracking-[0.22em] font-bold uppercase block mt-0.5 sm:mt-1 whitespace-nowrap ${
              isLightText ? 'text-[#C5D1A5]' : 'text-[#4F602F]'
            }`}
          >
            Kaftan & Luxury Pret
          </span>
        </div>
      )}
    </div>
  );
};
