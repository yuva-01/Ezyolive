import React from 'react';

const Logo = ({ className = 'h-10 w-auto' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" fill="#4285F4" />
      <path
        d="M30 30H70V70H30V30Z"
        fill="white"
        stroke="#4285F4"
        strokeWidth="4"
      />
      <path
        d="M40 50H60M50 40V60"
        stroke="#4285F4"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M30 20L70 20"
        stroke="#4285F4"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M30 80L70 80"
        stroke="#4285F4"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
