import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "ghost",
  children,
  className = "",
  ...props
}) => {
  /*
   * Explicit classes for Tailwind v4 scanner:
   * bg-blue-600 bg-blue-700 hover:bg-blue-700 text-white border-blue-700
   * bg-red-600 bg-red-700 hover:bg-red-700 border-red-700
   * bg-green-600 bg-green-700 hover:bg-green-700 border-green-700
   * bg-transparent text-gray-200 hover:bg-white/5 border-transparent
   */

  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150",
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-700 border border-blue-700",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700 border border-red-700",
        variant === "success" &&
          "bg-green-600 text-white hover:bg-green-700 border border-green-700",
        variant === "ghost" &&
          "bg-transparent text-gray-200 hover:bg-white/5 border border-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
