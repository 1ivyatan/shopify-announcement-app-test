export default function AnimatedBorder({
  radius,
  bg,
  color = "#1976ed",
  thickness = 7,
  speed = 4,
  shouldShow = false,
}: {
  radius: number | string;
  bg?: string;
  color?: string;
  thickness?: number;
  speed?: number;
  shouldShow?: boolean;
}) {
  if (!shouldShow) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: `-${thickness}px`,
        pointerEvents: "none",
        borderRadius: radius,
        zIndex: 0,
        overflow: "hidden",
        display: "block",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "99999px",
          height: "99999px",
          transform: "translate(-50%, -50%) rotate(0deg)",
          backgroundImage: `conic-gradient(rgba(0,0,0,0), ${color}, rgba(0,0,0,0) 25%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
          borderRadius: "inherit",
          animation: `TSUFFIX-border-rotate ${speed}s linear infinite`,
          zIndex: 0,
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: thickness,
          top: thickness,
          width: `calc(100% - ${thickness * 2}px)`,
          height: `calc(100% - ${thickness * 2}px)`,
          background: bg,
          borderRadius: radius as any,
          zIndex: 1,
          display: "block",
        }}
      />
      <style>
        {`
          @keyframes TSUFFIX-border-rotate {
            100% { transform: translate(-50%, -50%) rotate(1turn); }
          }
        `}
      </style>
    </div>
  );
}
