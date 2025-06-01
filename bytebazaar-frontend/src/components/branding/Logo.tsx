
import React from 'react';
import { useNavigate } from 'react-router-dom';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  withText = true,
  className = '' 
}) => {
  const navigate = useNavigate();

  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className={`flex items-center gap-2 cursor-pointer ${className}`} onClick={handleClick}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* First B */}
        <div className="absolute inset-0 text-primary font-bold flex items-center justify-center transform -translate-x-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M6 4C6 2.89543 6.89543 2 8 2H14C16.2091 2 18 3.79086 18 6C18 7.10457 17.5 8.1 16.5 8.7C17.5 9.3 18 10.3 18 11.5C18 13.7091 16.2091 15.5 14 15.5H8C6.89543 15.5 6 14.6046 6 13.5V4Z"
              fill="currentColor"
              className="animate-pulse-slow"
            />
            <path
              d="M12 8.5H14C14.5523 8.5 15 8.05228 15 7.5V6C15 5.44772 14.5523 5 14 5H12C11.4477 5 11 5.44772 11 6V7.5C11 8.05228 11.4477 8.5 12 8.5Z"
              fill="hsl(var(--background))"
            />
            <path
              d="M12 12.5H14C14.5523 12.5 15 12.0523 15 11.5V10C15 9.44772 14.5523 9 14 9H12C11.4477 9 11 9.44772 11 10V11.5C11 12.0523 11.4477 12.5 12 12.5Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
        
        {/* Second B */}
        <div className="absolute inset-0 text-indigo-500 font-bold flex items-center justify-center transform translate-x-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M6 4C6 2.89543 6.89543 2 8 2H14C16.2091 2 18 3.79086 18 6C18 7.10457 17.5 8.1 16.5 8.7C17.5 9.3 18 10.3 18 11.5C18 13.7091 16.2091 15.5 14 15.5H8C6.89543 15.5 6 14.6046 6 13.5V4Z"
              fill="currentColor"
              className="animate-pulse-slow"
            />
            <path
              d="M12 8.5H14C14.5523 8.5 15 8.05228 15 7.5V6C15 5.44772 14.5523 5 14 5H12C11.4477 5 11 5.44772 11 6V7.5C11 8.05228 11.4477 8.5 12 8.5Z"
              fill="hsl(var(--background))"
            />
            <path
              d="M12 12.5H14C14.5523 12.5 15 12.0523 15 11.5V10C15 9.44772 14.5523 9 14 9H12C11.4477 9 11 9.44772 11 10V11.5C11 12.0523 11.4477 12.5 12 12.5Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </div>
      
      {withText && (
        <div className={`font-bold ${textSizes[size]}`}>
          <span className="text-primary">Byte</span>
          <span className="text-indigo-500">Bazaar</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
