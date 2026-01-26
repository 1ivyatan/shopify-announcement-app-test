export default interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price: number;
  available: boolean;
  featured_image?: {
    src: string;
  };
}
