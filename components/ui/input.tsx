'use client';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={twMerge(
          'bg-surface-container-low border-none rounded-xl px-5 py-4 font-body text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none w-full transition-shadow duration-200',
          className
        )}
      />
    );
  }
);

Input.displayName = 'Input';
