import { useAppBridge } from "@shopify/app-bridge-react";

export const attemptReviewModal = async () => {
  const shopify = useAppBridge();
  try {
    const result = await shopify.reviews.request();
    localStorage.setItem("openedReview", "true");
    if (!result.success) {
      console.log(`Review modal not displayed. Reason: ${result.code}: ${result.message}`);
    }
    // if result.success *is* true, then review modal is displayed
  } catch (error) {
    console.error("Error requesting review:", error);
  }
};

export const hasReviewed = (): boolean => {
  const review: string | null = localStorage.getItem("openedReview");
  return review === "true";
};
