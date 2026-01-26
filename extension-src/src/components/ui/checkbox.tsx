import * as React from "react";
import usePresetStore from "@/stores/usePresetStore";
import { Check } from "lucide-react"; // Import Check icon from lucide-react

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  style?: React.CSSProperties;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", onCheckedChange, checked, defaultChecked, style = {}, ...props }, ref) => {
    const { presetDetails } = usePresetStore() as any;
    const [internalChecked, setInternalChecked] = React.useState<boolean>(
      checked !== undefined ? checked : defaultChecked || false
    );

    // Handle controlled component behavior
    React.useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        // Only update internal state if this is an uncontrolled component
        setInternalChecked(event.target.checked);
      }

      // Notify parent of the change
      onCheckedChange?.(event.target.checked);
      props.onChange?.(event);
    };

    // Combine class names
    const rootClasses = [
      "TSUFFIX-peer TSUFFIX-h-4 TSUFFIX-w-4 TSUFFIX-shrink-0 TSUFFIX-min-w-0 TSUFFIX-rounded-sm TSUFFIX-border TSUFFIX-shadow focus-visible:TSUFFIX-outline-none focus-visible:TSUFFIX-ring-1 disabled:TSUFFIX-cursor-not-allowed disabled:TSUFFIX-opacity-50",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Apply the checkbox style based on presetDetails and external style prop
    const checkboxStyle = React.useMemo(() => {
      // Default styles from presetDetails
      const defaultStyles = {
        background: internalChecked
          ? presetDetails.checkboxStyle === "filled"
            ? presetDetails.checkboxColor
            : "transparent"
          : "transparent",
        borderColor: presetDetails.checkboxColor || "#000000",
        position: "relative" as const,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: props.disabled ? "not-allowed" : "pointer",
      };

      // Override with any styles passed directly via the style prop
      return { ...defaultStyles, ...style };
    }, [internalChecked, presetDetails, props.disabled, style]);

    // Style for the check icon
    const checkIconStyle = React.useMemo(() => {
      // If external style includes specific check color styling, use it
      const checkColor =
        style.color ||
        (presetDetails.checkboxStyle === "filled"
          ? presetDetails.checkboxCheckColor
          : presetDetails.checkboxColor);

      return { color: checkColor };
    }, [presetDetails, style]);

    return (
      <div className={rootClasses} style={checkboxStyle}>
        <input
          type="checkbox"
          ref={ref}
          checked={internalChecked}
          onChange={handleChange}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "inherit",
            margin: "0 !important",
            padding: "0 !important",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            border: "none !important",
            background: "transparent !important",
            boxSizing: "border-box",
            outline: "none !important",
            top: 0,
            left: 0,
            pointerEvents: "auto",
          }}
          className="TSUFFIX-hidden-checkbox"
          aria-hidden="false"
          {...props}
        />

        {internalChecked && (
          <div className="TSUFFIX-flex TSUFFIX-items-center TSUFFIX-justify-center TSUFFIX-text-current">
            {presetDetails.type === "volumeDiscount" ? (
              <div
                className="TSUFFIX-h-2 TSUFFIX-w-2 TSUFFIX-rounded-full TSUFFIX-flex TSUFFIX-items-center TSUFFIX-justify-center"
                style={{
                  background: style.color || presetDetails.checkboxCheckColor,
                }}
                aria-hidden="true"
              ></div>
            ) : (
              <Check
                size={12}
                strokeWidth={3}
                style={checkIconStyle}
                className="TSUFFIX-stroke-[2.5px]"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
