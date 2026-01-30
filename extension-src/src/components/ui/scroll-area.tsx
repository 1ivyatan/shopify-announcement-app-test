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
      className={`LBTANN-relative LBTANN-overflow-auto LBTANN-scrollbar-hide ${className}`}
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE and Edge */,
        ...style,
      }}
    >
      <div className="LBTANN-min-w-full LBTANN-min-h-full">{children}</div>
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
            ? "LBTANN-h-2 LBTANN-bottom-0 LBTANN-left-0 LBTANN-right-4"
            : "LBTANN-w-2 LBTANN-top-0 LBTANN-right-0 LBTANN-bottom-4"
        } 
        LBTANN-flex LBTANN-relative LBTANN-touch-none LBTANN-select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className={`
        LBTANN-relative 
        LBTANN-flex-1 
        LBTANN-rounded-full 
        LBTANN-bg-gray-200
        LBTANN-opacity-50
        hover:LBTANN-opacity-100
        ${isHorizontal ? "LBTANN-h-full" : "LBTANN-w-full"}
      `}
      ></div>
    </div>
  );
};
