import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "success" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "ghost",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  /*
   * Explicit classes for Tailwind v4 scanner:
   * bg-blue-600 bg-blue-700 hover:bg-blue-700 text-white border-blue-700
   * bg-red-600 bg-red-700 hover:bg-red-700 border-red-700
   * bg-green-600 bg-green-700 hover:bg-green-700 border-green-700
   * bg-gray-600 bg-gray-700 hover:bg-gray-700 border-gray-700
   * bg-transparent text-gray-200 hover:bg-white/5 border-transparent
   */

  const isDisabled = disabled || loading;

  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        // Size variants
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        // Color variants
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-900/70",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700 border border-red-700 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/70",
        variant === "success" &&
          "bg-green-600 text-white hover:bg-green-700 border border-green-700 shadow-lg shadow-green-900/50 hover:shadow-xl hover:shadow-green-900/70",
        variant === "secondary" &&
          "bg-gray-600 text-white hover:bg-gray-700 border border-gray-700 shadow-lg shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-900/70",
        variant === "ghost" &&
          "bg-transparent text-gray-200 hover:bg-white/5 border border-transparent hover:border-gray-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
