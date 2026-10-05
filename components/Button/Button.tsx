"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "outline"
  | "ghost"
  | "link";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    // --------------------------------
    // Variants
    // --------------------------------

    const variants: Record<ButtonVariant, string> = {
      primary: `bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 focus-visible:ring-zinc-900/2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:focus-visible:ring-white/20
      `,

      secondary: `bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 focus-visible:ring-zinc-500/2 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600
      `,

      success: `bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500/30`,

      danger: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/30
      `,

      warning: `bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus-visible:ring-amber-500/30
      `,

      info: `bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500/30
      `,

      outline: `border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 focus-visible:ring-zinc-500/2 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:active:bg-zinc-800`,

      ghost: `bg-transparent text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 focus-visible:ring-zinc-500/ dark:text-zinc-300 dark:hover:bg-zinc-900 dark:active:bg-zinc-800
      `,

      link: `h-auto bg-transparent px-0 text-zinc-900 underline-offset-4 hover:underline focus-visible:ring dark:text-white
      `,
    };

    // --------------------------------
    // Sizes
    // --------------------------------

    const sizes: Record<ButtonSize, string> = {
      xs: `h-7 min-w-7 rounded-md px-2.5 text-xs
      `,

      sm: `h-9 min-w-9 rounded-lg px-3.5 text-sm
      `,

      md: `h-10 min-w-10 rounded-lg px-4 text-sm`,

      lg: `h-11 min-w-11 rounded-xl px-5 text-base`,

      xl: `h-12 min-w-12 rounded-xl px-6 text-base
      `,

      icon: `h-10 w-10 rounded-lg p-0`,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-4 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}
        `}
        {...props}
      >
        {/* Loading */}
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />

            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}

            {children}

            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
