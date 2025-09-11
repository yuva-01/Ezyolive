import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  rounded = false, 
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  const roundedStyles = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
