interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  thickness?: number;
  color?: string;
  length?: string | number;
  className?: string;
  margin?: string | number;
}

export default function Divider({
  orientation = "horizontal",
  variant = "solid",
  thickness = 1,
  color = "#e5e7eb",
  length = "100%",
  className = "",
  margin = "16px",
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  const styles = {
    [isHorizontal ? "width" : "height"]: length,
    [isHorizontal ? "height" : "width"]: `${thickness}px`,
    backgroundColor: variant === "solid" ? color : "transparent",
    borderStyle: variant !== "solid" ? variant : "none",
    borderColor: variant !== "solid" ? color : "transparent",
    borderWidth: variant !== "solid" ? `${thickness}px` : 0,
    [isHorizontal ? "marginTop" : "marginLeft"]: margin,
    [isHorizontal ? "marginBottom" : "marginRight"]: margin,
  };

  return (
    <div className={`TSUFFIX-flex-shrink-0 ${className}`} style={styles}>
      <div />
    </div>
  );
}
