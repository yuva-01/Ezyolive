import React from 'react';

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

const Avatar = ({ name, src, size = 'md', className = '' }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  if (src) {
    return (
      <img
        className={`${sizeClass} rounded-full ${className}`}
        src={src}
        alt={name || 'User avatar'}
      />
    );
  }
  
  // Generate a consistent color based on name
  const getColorClass = (name) => {
    if (!name) return 'bg-gray-400';
    const hash = name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const colors = [
      'bg-primary-500',
      'bg-secondary-500',
      'bg-accent-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-cyan-500',
    ];
    
    return colors[hash % colors.length];
  };
  
  return (
    <div
      className={`${sizeClass} ${getColorClass(
        name
      )} text-white font-medium rounded-full flex items-center justify-center ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
