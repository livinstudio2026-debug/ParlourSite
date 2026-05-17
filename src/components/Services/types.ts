export interface ServiceData {
  id: number;
  title: string;
  tagline: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  gradient: string;
  overlayGradient: string;
  accentColor: string;
  icon: string;
  badge?: string;
  image: string;          // ← real photo from assets/services/
}
