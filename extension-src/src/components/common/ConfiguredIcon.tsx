// Stores
import usePresetStore from "@/stores/usePresetStore";
// Icons
import {
  Zap,
  Package,
  Tag,
  Percent,
  ShoppingCart,
  Gift,
  Coins,
  Sparkles,
  TrendingUp,
  Wallet,
  Award,
} from "lucide-react";

/**
 * ConfiguredIcon component renders an icon based on the provided icon name, size, and color.
 * @param {Object} props - The properties for the component.
 * @param {string} props.icon - The name of the icon to render. tag, wallet etc
 * @param {string} props.color - The color of the icon. hex
 * @param {string} props.size - The size of the icon. Can be "x-small", "small", "medium", "large", or "x-large".
 */
export default function ConfiguredIcon({
  icon,
  size = "medium",
  intSize = undefined,
  color,
}: {
  icon: string;
  color: string;
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  intSize?: number;
}) {
  const { presetDetails } = usePresetStore() as any;
  if (!presetDetails) return null;

  let iconSize = 16;
  if (!intSize) {
    if (size === "x-small") {
      iconSize = 14;
    } else if (size === "small") {
      iconSize = 16;
    } else if (size === "medium") {
      iconSize = 18;
    } else if (size === "large") {
      iconSize = 24;
    } else if (size === "x-large") {
      iconSize = 32;
    }
  } else {
    iconSize = intSize;
  }

  const iconStyle = {
    color: color,
    width: `${iconSize}px`,
    height: `${iconSize}px`,
  };

  return (
    <>
      {icon === "package" && <Package style={iconStyle} />}
      {icon === "tag" && <Tag style={iconStyle} />}
      {icon === "percent" && <Percent style={iconStyle} />}
      {icon === "shopping-cart" && <ShoppingCart style={iconStyle} />}
      {icon === "gift" && <Gift style={iconStyle} />}
      {icon === "coins" && <Coins style={iconStyle} />}
      {icon === "sparkles" && <Sparkles style={iconStyle} />}
      {icon === "trending-up" && <TrendingUp style={iconStyle} />}
      {icon === "wallet" && <Wallet style={iconStyle} />}
      {icon === "award" && <Award style={iconStyle} />}
      {icon === "zap" && <Zap style={iconStyle} />}
    </>
  );
}
