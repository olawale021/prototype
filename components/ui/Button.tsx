'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 active:bg-amber-500 shadow-lg shadow-amber-400/25 hover:shadow-xl hover:shadow-amber-400/30 focus-visible:ring-amber-400',
    secondary:
      'bg-white/60 dark:bg-white/10 backdrop-blur-xl text-slate-700 dark:text-slate-200 border border-white/40 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 shadow-lg shadow-black/5 focus-visible:ring-slate-400',
    outline:
      'bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/15 shadow-md shadow-black/5 focus-visible:ring-slate-400',
    ghost:
      'text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-sm focus-visible:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
