'use client';
import { twMerge } from 'tailwind-merge';
import type { InputHTMLAttributes } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      {...props}
      className={twMerge(
        'w-5 h-5 rounded-full accent-primary cursor-pointer border-outline flex-shrink-0',
        className
      )}
    />
  );
}
