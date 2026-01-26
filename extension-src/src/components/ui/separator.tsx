import * as React from "react";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the separator.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * When true, indicates that the separator is purely visual and doesn't serve as a semantic boundary.
   * @default true
   */
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className = "", orientation = "horizontal", decorative = true, ...props }, ref) => {
    // Combine class names
    const classNames = [
      "TSUFFIX-shrink-0 TSUFFIX-block",
      orientation === "horizontal"
        ? "TSUFFIX-h-[1px] TSUFFIX-w-full"
        : "TSUFFIX-h-full TSUFFIX-w-[1px]",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Determine appropriate ARIA role
    const ariaProps = decorative
      ? { "aria-hidden": true }
      : { role: "separator", "aria-orientation": orientation };

    return <div ref={ref} className={classNames} {...ariaProps} {...props} />;
  }
);

Separator.displayName = "Separator";

export { Separator };
