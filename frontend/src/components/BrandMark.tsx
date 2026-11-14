import React from 'react';
import paytmAiLogo from '../assets/paytmailogo.png';

interface BrandMarkProps {
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = '' }) => (
  <span className={`block overflow-hidden ${className}`}>
    <img src={paytmAiLogo} alt="Paytm AI" className="h-full w-full object-cover object-center" />
  </span>
);
