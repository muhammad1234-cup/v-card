import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-zinc-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 pointer-events-none text-zinc-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-zinc-900 border rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-zinc-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-zinc-700'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 pointer-events-none text-zinc-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-zinc-400">{helperText}</p>}
    </div>
  );
};
