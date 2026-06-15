import React from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "tertiary";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variant of the button (default: primary) */
  variant?: Variant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      className,
      disabled = false,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const base =
      "w-full rounded-full border border-solid inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-orange-500)] disabled:focus-visible:ring-0";

    const size =
      "py-[12px] sm:py-[14px] lg:py-[16px] text-[16px] sm:text-[16px] lg:text-[18px] font-medium";

    const variantClasses =
      variant === "secondary"
        ? [
            "bg-[var(--color-white)]",
            "border-[var(--color-orange-500)]",
            "text-[var(--color-orange-500)]",
            "disabled:border-[var(--color-gray-300)]",
            "disabled:text-[var(--color-gray-300)]",
          ].join(" ")
        : variant === "tertiary"
          ? [
              "bg-[var(--color-white)]",
              "border-[var(--color-gray-700)]",
              "text-[var(--color-gray-700)]",
              "disabled:border-[var(--color-gray-500)]",
              "disabled:text-[var(--color-gray-500)]",
            ].join(" ")
          : /* primary */ [
              "bg-[var(--color-orange-600)]",
              "border-[var(--color-orange-600)]",
              "text-[var(--color-white)]",
              "active:bg-[var(--color-white)]",
              "active:text-[var(--color-orange-600)]",
              "disabled:bg-[var(--color-gray-200)]",
              "disabled:text-[var(--color-gray-500)]",
              "disabled:border-[var(--color-gray-500)]",
            ].join(" ");

    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant}
        className={cn(base, size, variantClasses, className)}
        disabled={disabled}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
