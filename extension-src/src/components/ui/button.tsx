import * as React from "react";

// Define button variants and sizes as regular string classes
const BUTTON_BASE_CLASSES =
  "TSUFFIX-inline-flex TSUFFIX-items-center TSUFFIX-justify-center TSUFFIX-gap-2 TSUFFIX-whitespace-nowrap TSUFFIX-transition-colors focus-visible:TSUFFIX-outline-none disabled:TSUFFIX-pointer-events-none disabled:TSUFFIX-opacity-50";

const BUTTON_SIZES = {
  default: "TSUFFIX-h-9 TSUFFIX-px-4 TSUFFIX-py-2",
  sm: "TSUFFIX-h-[28px] TSUFFIX-rounded-md TSUFFIX-px-3 TSUFFIX-text-xs",
  lg: "TSUFFIX-h-10 TSUFFIX-rounded-md TSUFFIX-px-8",
  icon: "TSUFFIX-h-9 TSUFFIX-w-9",
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
