
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => {
  return (
    <img
      src="/twh-logo-v2.png"
      alt="TWH Logo"
      className={`${className} object-contain drop-shadow-lg transform scale-125 mx-auto block`}
    />
  );
};
