import * as React from "react";

// Define button variants and sizes as regular string classes
const BUTTON_BASE_CLASSES =
  "LBTANN-inline-flex LBTANN-items-center LBTANN-justify-center LBTANN-gap-2 LBTANN-whitespace-nowrap LBTANN-transition-colors focus-visible:LBTANN-outline-none disabled:LBTANN-pointer-events-none disabled:LBTANN-opacity-50";

const BUTTON_SIZES = {
  default: "LBTANN-h-9 LBTANN-px-4 LBTANN-py-2",
  sm: "LBTANN-h-[28px] LBTANN-rounded-md LBTANN-px-3 LBTANN-text-xs",
  lg: "LBTANN-h-10 LBTANN-rounded-md LBTANN-px-8",
  icon: "LBTANN-h-9 LBTANN-w-9",
};

export type ButtonSize = keyof typeof BUTTON_SIZES;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  children: React.ReactNode;
}

/**
 * A simple button component with various style variants and sizes
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", size = "default", children, ...props }, ref) => {
    // Combine all the classes for the button
    const buttonClasses = [
      BUTTON_BASE_CLASSES,
      BUTTON_SIZES[size] || BUTTON_SIZES.default,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
