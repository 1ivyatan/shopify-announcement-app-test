import React, { useRef } from "react";

interface ScrollAreaProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

interface ScrollBarProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const ScrollArea = ({ className = "", style, children }: ScrollAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`TSUFFIX-relative TSUFFIX-overflow-auto TSUFFIX-scrollbar-hide ${className}`}
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE and Edge */,
        ...style,
      }}
    >
      <div className="TSUFFIX-min-w-full TSUFFIX-min-h-full">{children}</div>
    </div>
  );
};

export const ScrollBar = ({ orientation = "vertical", className = "" }: ScrollBarProps) => {
  // This is now just a visual component since we're using native scrolling
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`
        ${
          isHorizontal
            ? "TSUFFIX-h-2 TSUFFIX-bottom-0 TSUFFIX-left-0 TSUFFIX-right-4"
            : "TSUFFIX-w-2 TSUFFIX-top-0 TSUFFIX-right-0 TSUFFIX-bottom-4"
        } 
        TSUFFIX-flex TSUFFIX-relative TSUFFIX-touch-none TSUFFIX-select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className={`
        TSUFFIX-relative 
        TSUFFIX-flex-1 
        TSUFFIX-rounded-full 
        TSUFFIX-bg-gray-200
        TSUFFIX-opacity-50
        hover:TSUFFIX-opacity-100
        ${isHorizontal ? "TSUFFIX-h-full" : "TSUFFIX-w-full"}
      `}
      ></div>
    </div>
  );
};
