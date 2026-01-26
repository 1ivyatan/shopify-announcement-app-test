export const getImageSize = (imageSize: string): number => {
  switch (imageSize) {
    case "small":
      return 60;
    case "medium":
      return 80;
    case "large":
      return 104;
    default:
      return 104;
  }
};
