import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

type ButtonVariant = "primary" | "ghost" | "danger" | "success" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "ghost",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  /*
   * Explicit classes for Tailwind v4 scanner:
   * bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-500 shadow-blue-900/60 border-blue-500/70
   * from-emerald-500 via-emerald-600 to-teal-600 shadow-emerald-900/60 border-emerald-500/70
   * from-rose-500 via-rose-600 to-red-600 shadow-rose-900/60 border-rose-500/70
   * from-slate-500 via-slate-600 to-gray-700 shadow-slate-900/60 border-slate-500/70
   * bg-transparent text-gray-200 hover:bg-white/5 border-transparent backdrop-blur-sm
   */

  const isDisabled = disabled || loading;

  const baseClasses = [
    "button-aurora",
    "group",
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-0",
    "rounded-xl",
    "font-semibold",
    "tracking-tight",
    "transition-all",
    "duration-200",
    "active:scale-95",
    "disabled:opacity-60",
    "disabled:cursor-not-allowed",
    "disabled:active:scale-100",
    "shadow-lg",
    "hover:shadow-xl",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-gray-950",
    fullWidth && "w-full",
    size === "sm" && "px-3 py-1.5 text-xs",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-6 py-3 text-base",
  ];

  const variantClasses = [
    variant === "primary" &&
      "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white border border-blue-500/70 shadow-blue-900/60 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-500 focus-visible:ring-blue-300/70",
    variant === "danger" &&
      "bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 text-white border border-rose-500/70 shadow-rose-900/60 hover:from-rose-500 hover:via-rose-600 hover:to-red-500 focus-visible:ring-rose-300/70",
    variant === "success" &&
      "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white border border-emerald-500/70 shadow-emerald-900/60 hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-500 focus-visible:ring-emerald-300/70",
    variant === "secondary" &&
      "bg-gradient-to-r from-slate-500 via-slate-600 to-gray-700 text-white border border-slate-500/70 shadow-slate-900/60 hover:from-slate-500 hover:via-slate-600 hover:to-gray-600 focus-visible:ring-slate-300/70",
    variant === "ghost" &&
      "bg-transparent text-gray-200 hover:bg-white/5 border border-transparent hover:border-gray-600/60 backdrop-blur-sm shadow-none hover:shadow-none focus-visible:ring-gray-400/50",
  ];

  const resolvedIcon = loading ? (
    <LoadingSpinner size="sm" className="text-current" />
  ) : (
    icon
  );
  const iconElement = resolvedIcon ? (
    <span className="flex h-4 w-4 items-center justify-center text-[1.05em]">
      {resolvedIcon}
    </span>
  ) : null;

  return (
    <button
      className={[...baseClasses, ...variantClasses, className]
        .filter(Boolean)
        .join(" ")}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...props}
    >
      <span
        className={[
          "button-content relative z-[1] inline-flex items-center justify-center gap-2 px-0",
          fullWidth && "w-full",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {iconElement && iconPosition === "left" && iconElement}
        <span className="whitespace-nowrap leading-none">{children}</span>
        {iconElement && iconPosition === "right" && iconElement}
      </span>
    </button>
  );
};
