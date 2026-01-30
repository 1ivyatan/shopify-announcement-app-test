"use client";

import React from "react";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  presetDetails?: any;
  hideIfUnclickable?: boolean;
  childContainerClassName?: string;
  idkAnymoreClassName?: string;
  manualControls?: boolean;
  scrollPrevRef?: React.MutableRefObject<(() => void) | null>;
  scrollNextRef?: React.MutableRefObject<(() => void) | null>;
  onScrollStateChange?: (state: { canScrollLeft: boolean; canScrollRight: boolean }) => void;
  wrapScroll?: boolean;
}

const findMinBadgeTopDistance = (presetDetails: any) => {
  const badges = presetDetails?.badges?.length;
  return badges ? 30 : 0;
};

export default function OverflowCarousel({
  children,
  className = "",
  showArrows = true,
  presetDetails,
  hideIfUnclickable = false,
  childContainerClassName = "",
  idkAnymoreClassName = "",
  manualControls = false,
  scrollPrevRef,
  scrollNextRef,
  onScrollStateChange,
  wrapScroll = false,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [minBadgeTopDistance, setMinBadgeTopDistance] = useState(0);
  // Check if content overflows and update control visibility
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        const hasOverflow = scrollWidth > clientWidth;
        setShowControls(hasOverflow);
        setMaxScroll(scrollWidth - clientWidth);
      }
    };

    // Initial check
    checkOverflow();
    setTimeout(checkOverflow, 100); //dirty af

    // Check on resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children]);
  // Update scroll position when scrolling
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      // Round to prevent sub-pixel issues
      setScrollPosition(Math.round(scrollContainerRef.current.scrollLeft));
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    const minBadgeTopDistance = findMinBadgeTopDistance(presetDetails);
    setMinBadgeTopDistance(minBadgeTopDistance);
  }, [presetDetails]);

  // Expose scroll state for manual controls
  useEffect(() => {
    if (onScrollStateChange) {
      const canScrollLeft = scrollPosition > 16 || wrapScroll;
      const canScrollRight = scrollPosition < maxScroll - 16 || wrapScroll;
      onScrollStateChange({ canScrollLeft, canScrollRight });
    }
  }, [scrollPosition, maxScroll, onScrollStateChange]);

  // Define scroll functions first
  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const currentScroll = scrollContainerRef.current.scrollLeft;

      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const currentMaxScroll = scrollWidth - clientWidth;

      // For single card carousels (manual controls), scroll by full container width
      const scrollAmount = manualControls ? containerWidth : containerWidth + 1;
      const targetScroll = currentScroll - scrollAmount;

      // If we're within 16 pixels of the start, just go to the start

      if (wrapScroll && currentScroll <= 16) {
        // Wrap to end
        scrollContainerRef.current.scrollTo({
          left: currentMaxScroll,
          behavior: "smooth",
        });
      } else {
        const finalScroll = targetScroll <= 16 ? 0 : targetScroll;
        scrollContainerRef.current.scrollTo({
          left: finalScroll,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const currentMaxScroll = scrollWidth - clientWidth;

      const scrollAmount = manualControls ? containerWidth : containerWidth + 1;
      const targetScroll = currentScroll + scrollAmount;

      if (wrapScroll && currentScroll >= currentMaxScroll - 16) {
        scrollContainerRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        const finalScroll = targetScroll >= currentMaxScroll - 16 ? currentMaxScroll : targetScroll;
        scrollContainerRef.current.scrollTo({
          left: finalScroll,
          behavior: "smooth",
        });
      }
    }
  };

  // Expose scroll functions for manual controls
  useEffect(() => {
    if (scrollPrevRef && manualControls) {
      scrollPrevRef.current = scrollPrev;
    }
    if (scrollNextRef && manualControls) {
      scrollNextRef.current = scrollNext;
    }
  }, [scrollPrevRef, scrollNextRef, manualControls]);

  return (
    <div className={`LBTANN-overflow-carousel LBTANN-relative LBTANN-w-full ${className}`}>
      {" "}
      {/* Carousel container */}
      <div
        ref={scrollContainerRef}
        className={`LBTANN-flex LBTANN-overflow-x-auto LBTANN-scrollbar-hide LBTANN-snap-x LBTANN-px-2 LBTANN-min-h-0 LBTANN-relative LBTANN-overflow-visible ${
          !showControls ? "LBTANN-justify-center" : ""
        } ${idkAnymoreClassName}`}
        style={{
          gap: presetDetails?.offerItemGap + "px" || "8px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingTop: minBadgeTopDistance + "px",
          marginTop: Math.floor(minBadgeTopDistance * -0.5) + "px",
          marginLeft: "1px",
          marginRight: "1px",
        }}
        onScroll={handleScroll}
      >
        {/* Apply snap-center to each child */}
        {React.Children.map(children, (child) => (
          <div
            className={`LBTANN-flex-none LBTANN-snap-center !LBTANN-max-w-none ${childContainerClassName}`}
          >
            {child}
          </div>
        ))}
      </div>
      {/* Navigation arrows - only shown if content overflows */}
      {showArrows && showControls && !manualControls && (
        <>
          <button
            onClick={scrollPrev}
            className={`LBTANN-absolute LBTANN-left-0 LBTANN-top-1/2 LBTANN--translate-y-1/2 LBTANN-bg-white LBTANN-rounded-full LBTANN-p-2 LBTANN-shadow-lg LBTANN-z-10 LBTANN-transition-all LBTANN-duration-200 hover:LBTANN-bg-gray-50 LBTANN-border LBTANN-border-gray-200 ${
              scrollPosition <= 16
                ? hideIfUnclickable && !wrapScroll
                  ? " LBTANN-hidden "
                  : " LBTANN-opacity-40 LBTANN-cursor-not-allowed "
                : " LBTANN-opacity-100 hover:LBTANN-scale-105 "
            }`}
            disabled={!wrapScroll && scrollPosition <= 16}
            aria-label="Scroll left"
            role="button"
            type="button"
          >
            <ChevronLeft className="LBTANN-h-5 LBTANN-w-5 LBTANN-text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            className={`LBTANN-absolute LBTANN-right-0 LBTANN-top-1/2 LBTANN--translate-y-1/2 LBTANN-bg-white LBTANN-rounded-full LBTANN-p-2 LBTANN-shadow-lg LBTANN-z-10 LBTANN-transition-all LBTANN-duration-200 hover:LBTANN-bg-gray-50 LBTANN-border LBTANN-border-gray-200 ${
              scrollPosition >= maxScroll - 16
                ? hideIfUnclickable && !wrapScroll
                  ? " LBTANN-hidden "
                  : " LBTANN-opacity-40 LBTANN-cursor-not-allowed "
                : " LBTANN-opacity-100 hover:LBTANN-scale-105 "
            }`}
            disabled={!wrapScroll && scrollPosition >= maxScroll - 16}
            aria-label="Scroll right"
            role="button"
            type="button"
          >
            <ChevronRight className="LBTANN-h-5 LBTANN-w-5 LBTANN-text-gray-700" />
          </button>
        </>
      )}
    </div>
  );
}
