import React, { useState } from 'react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showGoogleBadge?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  showGoogleBadge = false,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  const badgeSizeClasses = {
    xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 p-[1px]',
    sm: 'w-3 h-3 -bottom-0.5 -right-0.5 p-[1.5px]',
    md: 'w-3.5 h-3.5 bottom-0 right-0 p-[2px]',
    lg: 'w-5 h-5 bottom-0 right-0 p-[3px]',
    xl: 'w-6 h-6 bottom-0.5 right-0.5 p-[3.5px]',
  };

  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {avatarUrl && !hasError ? (
        <img
          src={avatarUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`${sizeClasses[size]} rounded-full object-cover border border-[#E8E2D8] bg-white shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold font-sans shadow-xs border border-white`}
          title={name}
        >
          {initial}
        </div>
      )}

      {showGoogleBadge && (
        <div
          className={`absolute ${badgeSizeClasses[size]} rounded-full bg-white shadow-xs border border-[#E8E2D8] flex items-center justify-center`}
          title="Google Account"
        >
          <svg className="w-full h-full" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
