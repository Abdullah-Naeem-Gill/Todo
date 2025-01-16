
import React from 'react';

const Button = ({ color = 'blue', text, onClick, size = 'md', disabled = false }) => {

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
    red: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    indigo: 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500',
  };
  const buttonClass = `${sizeClasses[size]} ${colorClasses[color]} text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
