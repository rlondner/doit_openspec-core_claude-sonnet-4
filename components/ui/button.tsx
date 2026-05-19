'use client';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 font-label font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-radiant-primary text-on-primary rounded-full px-6 py-3 shadow-[0_4px_16px_-4px_rgba(240,122,80,0.4)] hover:shadow-[0_8px_24px_-4px_rgba(240,122,80,0.5)] hover:scale-[1.02] active:scale-[0.98]':
              variant === 'primary',
            'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg px-4 py-2':
              variant === 'ghost',
          },
          className
        )
      )}
    >
      {children}
    </button>
  );
}
