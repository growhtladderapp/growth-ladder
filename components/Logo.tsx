
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <img
      src="/logo-new.png"
      alt="Growth Ladder Logo"
      className={`${className} object-contain drop-shadow-lg`}
    />
  );
};
