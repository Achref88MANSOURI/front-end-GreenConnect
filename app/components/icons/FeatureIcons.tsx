import React from 'react';

type IconProps = {
  className?: string;
};

export const PriceTransparencyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <rect x="3" y="10" width="3" height="7" rx="0.5" />
    <rect x="8.5" y="6" width="3" height="11" rx="0.5" />
    <rect x="14" y="3" width="3" height="14" rx="0.5" />
    <path d="M3 20h14" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SecurityCheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M12 2l7 3v5c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V5l7-3z" />
    <path d="M9 12l2 2 4-4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LocalSustainabilityIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M12 22s8-4.5 8-11a8 8 0 0 0-16 0c0 6.5 8 11 8 11z" />
    <path d="M8 12s1-3 4-3 4 3 4 3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default {
  PriceTransparencyIcon,
  SecurityCheckIcon,
  LocalSustainabilityIcon,
};
