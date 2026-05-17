export interface GalleryItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  cta?: string;
  size: "tall" | "wide" | "normal" | "large";
}
