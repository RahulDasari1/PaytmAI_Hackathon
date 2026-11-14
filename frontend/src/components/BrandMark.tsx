import React from 'react';

interface BrandMarkProps {
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18.5 39.5 7.7 29.2C1.8 23.6 5.8 13.8 13.8 13.8c3.4 0 6 1.8 7.8 4.2 1.8-2.4 4.4-4.2 7.8-4.2 8 0 12 9.8 6.1 15.4L24.7 39.5a4.5 4.5 0 0 1-6.2 0Z"
      fill="#E91E63"
    />
    <path
      d="M38.5 3.5 41 11l7.5 2.5L41 16l-2.5 7.5L36 16l-7.5-2.5L36 11l2.5-7.5Z"
      fill="#00BAF2"
      transform="translate(-3 -1)"
    />
    <path
      d="m8 2 1.2 3.6L13 7l-3.8 1.3L8 12l-1.3-3.7L3 7l3.7-1.4L8 2Z"
      fill="#002970"
      transform="translate(30 28)"
    />
  </svg>
);
