
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-11 h-11" }) => {
  return (
    <img
      src="/twh-logo.png"
      alt="TWH Logo"
      className={`${className} object-contain drop-shadow-lg`}
    />
  );
};
