import { CURATED_PRODUCTS, type Product } from '../constants/products';
import type { SkinType } from './profileService';

export type ProductQuery = {
  skinType?: SkinType | null;
  concerns?: string[];
  isPremium?: boolean;
};

/**
 * Gets personalized product recommendations based on user's skin profile.
 * Implements the Business logic:
 *   - FREE users get up to 10 products
 *   - PREMIUM users get all recommendations
 */
export function getRecommendedProducts(query: ProductQuery): Product[] {
  const { skinType, concerns = [], isPremium = false } = query;

  // Filter products by skin type and skin concerns
  let recommended = CURATED_PRODUCTS.filter((product) => {
    // Check skin type compatibility
    const matchesSkin =
      product.skinType === 'all' ||
      !skinType ||
      product.skinType === skinType;

    // Check concern matches
    const matchesConcern =
      product.concerns.length === 0 ||
      concerns.length === 0 ||
      product.concerns.some((c) => concerns.includes(c));

    return matchesSkin && matchesConcern;
  });

  // Sort recommendations so priority concern matches appear first
  recommended.sort((a, b) => {
    const aMatches = a.concerns.filter((c) => concerns.includes(c)).length;
    const bMatches = b.concerns.filter((c) => concerns.includes(c)).length;
    return bMatches - aMatches;
  });

  // Gating rule: Free users get up to 10 product recommendations.
  if (!isPremium) {
    recommended = recommended.slice(0, 10);
  }

  return recommended;
}

/**
 * Formats/builds specific affiliate URLs with tracking codes if necessary.
 */
export function buildAffiliateUrl(
  product: Product,
  platform: 'amazon_ae' | 'iherb' | 'yesstyle'
): string | null {
  const links = product.affiliate;
  return links[platform] || null;
}
