export type MediaType = "image" | "video";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeroSlide {
  id: string;
  mediaType: MediaType;
  mediaUrl: string;
  buttonText: string;
  buttonUrl: string;
  aspectRatio?: string; // For videos to maintain original ratio
}

export interface RichTextContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
}

export interface ProductCard {
  title: string;
  imageUrl: string;
  price?: string;
  linkUrl: string;
  imageRatio: string;
}

export interface CollageSection {
  title: string;
  reverse?: boolean;
  largeCard: ProductCard;
  stackedCards: ProductCard[];
}

export interface FeaturedSection {
  title: string;
  items: ProductCard[];
  buttonText: string;
  buttonUrl: string;
}

export interface NewsletterContent {
  title: string;
  subtitle: string;
}

export interface FooterContent {
  marketLabel: string;
  languageLabel: string;
  copyrightLine: string;
  companyLine: string;
}

export interface SiteContent {
  navigation: NavItem[];
  heroSlides: HeroSlide[];
  richText: RichTextContent;
  collectionsHeading: string;
  collections: CollectionItem[];
  collageOne: CollageSection;
  featuredSection: FeaturedSection;
  collageTwo: CollageSection;
  newsletter: NewsletterContent;
  footer: FooterContent;
}
