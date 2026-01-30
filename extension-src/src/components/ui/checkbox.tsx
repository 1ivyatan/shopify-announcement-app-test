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
      "LBTANN-peer LBTANN-h-4 LBTANN-w-4 LBTANN-shrink-0 LBTANN-min-w-0 LBTANN-rounded-sm LBTANN-border LBTANN-shadow focus-visible:LBTANN-outline-none focus-visible:LBTANN-ring-1 disabled:LBTANN-cursor-not-allowed disabled:LBTANN-opacity-50",
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
          className="LBTANN-hidden-checkbox"
          aria-hidden="false"
          {...props}
        />

        {internalChecked && (
          <div className="LBTANN-flex LBTANN-items-center LBTANN-justify-center LBTANN-text-current">
            {presetDetails.type === "volumeDiscount" ? (
              <div
                className="LBTANN-h-2 LBTANN-w-2 LBTANN-rounded-full LBTANN-flex LBTANN-items-center LBTANN-justify-center"
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
                className="LBTANN-stroke-[2.5px]"
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
