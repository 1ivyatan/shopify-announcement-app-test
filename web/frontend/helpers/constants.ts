import { app1, app2, app3, wt1, wt2, wt3 } from "../assets";
import { localizedDefaults, localizedDynamicDefaults } from "./localizedConstants";

interface App {
  title: string;
  image: string;
  description: string;
  location: string;
  link: string;
}

interface FontSizeOption {
  label: string;
  value: number;
}

interface TextWeightOption {
  label: string;
  value: string;
}

interface IconOption {
  label: string;
  value: string;
}

export const apps: App[] = [
  {
    title: "Apps.AnnTitle",
    image: app1,
    description: "Apps.AnnBar",
    location: "annbar_ad",
    link: "https://apps.shopify.com/add-announcement-bar?mref=naszkryz",
  },
  {
    title: "Apps.AMZTitle",
    image: app3,
    description: "Apps.AMZ",
    location: "amz_ad",
    link: "https://apps.shopify.com/price-comparison-funnel?mref=naszkryz",
  },
  {
    title: "Apps.StickyTitle",
    image: app2,
    description: "Apps.Sticky",
    location: "sticky_ad",
    link: "https://apps.shopify.com/add-sticky-checkout?mref=naszkryz",
  },
];

export const fontSizes: FontSizeOption[] = Array.from({ length: 25 }, (_, i) => ({
  label: `${i + 8}px`,
  value: i + 8,
}));

export function getFontSizes(length: number = 25): FontSizeOption[] {
  return Array.from({ length }, (_, i) => ({
    label: `${i + 8}px`,
    value: i + 8,
  }));
}

export const textWeightOptions = (): TextWeightOption[] => {
  return [
    { label: "Light", value: "300" },
    { label: "Regular", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semi-bold", value: "600" },
    { label: "Bold", value: "700" },
    { label: "Extra-bold", value: "800" },
    { label: "Black", value: "900" },
  ];
};
export const widgetTitleIconOptions: IconOption[] = [
  { label: "None", value: "" },
  { label: "Package", value: "package" },
  { label: "Tag", value: "tag" },
  { label: "Percent", value: "percent" },
  { label: "Shopping cart", value: "shopping-cart" },
  { label: "Gift", value: "gift" },
  { label: "Coins", value: "coins" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Trending up", value: "trending-up" },
  { label: "Wallet", value: "wallet" },
  { label: "Award", value: "award" },
  { label: "Zap", value: "zap" },
];

export const widgetTitleIconSizeOptions: IconOption[] = [
  { label: "X-Small", value: "x-small" },
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "X-Large", value: "x-large" },
];
