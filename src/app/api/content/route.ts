import { NextResponse } from "next/server";

import { getSiteContent, saveSiteContent } from "@/lib/content";
import type { CollectionItem, HeroSlide, RichTextContent, SiteContent, CollageSection, FeaturedSection, ProductCard } from "@/lib/types";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseSlides(input: unknown, fallback: HeroSlide[]) {
  if (!Array.isArray(input)) {
    return fallback;
  }

  return input
    .map((slide, index) => {
      const candidate = slide as Partial<HeroSlide>;
      const mediaUrl = asString(candidate.mediaUrl);

      if (!mediaUrl) {
        return null;
      }

      return {
        id: asString(candidate.id) || `slide-${Date.now()}-${index}`,
        mediaType: candidate.mediaType === "video" ? "video" : "image",
        mediaUrl,
        buttonText: asString(candidate.buttonText),
        buttonUrl: asString(candidate.buttonUrl)
      } satisfies HeroSlide;
    })
    .filter(Boolean) as HeroSlide[];
}

function normaliseCollections(input: unknown, fallback: CollectionItem[]) {
  if (!Array.isArray(input)) {
    return fallback;
  }

  return input
    .map((collection, index) => {
      const candidate = collection as Partial<CollectionItem>;
      const title = asString(candidate.title);
      const imageUrl = asString(candidate.imageUrl);
      const linkUrl = asString(candidate.linkUrl);

      if (!title || !imageUrl || !linkUrl) {
        return null;
      }

      return {
        id: asString(candidate.id) || `collection-${Date.now()}-${index}`,
        title,
        imageUrl,
        linkUrl
      } satisfies CollectionItem;
    })
    .filter(Boolean) as CollectionItem[];
}

function normaliseRichText(input: unknown, fallback: RichTextContent) {
  if (!input || typeof input !== "object") {
    return fallback;
  }

  const candidate = input as Partial<RichTextContent>;
  const title = asString(candidate.title);
  const subtitle = asString(candidate.subtitle);
  const buttonText = asString(candidate.buttonText);
  const buttonUrl = asString(candidate.buttonUrl);

  if (!title || !subtitle || !buttonText || !buttonUrl) {
    return fallback;
  }

  return {
    title,
    subtitle,
    buttonText,
    buttonUrl
  } satisfies RichTextContent;
}

function normaliseProductCard(input: unknown): ProductCard | null {
  if (!input || typeof input !== "object") {
    return null;
  }
  const candidate = input as Partial<ProductCard>;
  const title = asString(candidate.title);
  const imageUrl = asString(candidate.imageUrl);
  const linkUrl = asString(candidate.linkUrl);
  const imageRatio = asString(candidate.imageRatio) || "100%";

  if (!title || !imageUrl || !linkUrl) {
    return null;
  }

  return {
    title,
    imageUrl,
    price: asString(candidate.price),
    linkUrl,
    imageRatio
  };
}

function normaliseCollage(input: unknown, fallback: CollageSection): CollageSection {
  if (!input || typeof input !== "object") {
    return fallback;
  }

  const candidate = input as Partial<CollageSection>;
  const title = asString(candidate.title);
  const largeCard = normaliseProductCard(candidate.largeCard);
  const stackedCards = Array.isArray(candidate.stackedCards)
    ? (candidate.stackedCards.map(normaliseProductCard).filter(Boolean) as ProductCard[])
    : null;

  if (!title || !largeCard || !stackedCards) {
    return fallback;
  }

  return {
    title,
    reverse: !!candidate.reverse,
    largeCard,
    stackedCards
  };
}

function normaliseFeatured(input: unknown, fallback: FeaturedSection): FeaturedSection {
  if (!input || typeof input !== "object") {
    return fallback;
  }

  const candidate = input as Partial<FeaturedSection>;
  const title = asString(candidate.title);
  const items = Array.isArray(candidate.items)
    ? (candidate.items.map(normaliseProductCard).filter(Boolean) as ProductCard[])
    : null;
  const buttonText = asString(candidate.buttonText);
  const buttonUrl = asString(candidate.buttonUrl);

  if (!title || !items || !buttonText || !buttonUrl) {
    return fallback;
  }

  return {
    title,
    items,
    buttonText,
    buttonUrl
  };
}

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  try {
    const existing = await getSiteContent();
    const payload = (await request.json()) as Partial<SiteContent>;

    const updated: SiteContent = {
      ...existing,
      heroSlides: normaliseSlides(payload.heroSlides, existing.heroSlides),
      collections: normaliseCollections(payload.collections, existing.collections),
      richText: normaliseRichText(payload.richText, existing.richText),
      collageOne: normaliseCollage(payload.collageOne, existing.collageOne),
      featuredSection: normaliseFeatured(payload.featuredSection, existing.featuredSection),
      collageTwo: normaliseCollage(payload.collageTwo, existing.collageTwo)
    };

    await saveSiteContent(updated);

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update content."
      },
      { status: 500 }
    );
  }
}
