import { checkHalalIngredients, type HalalCheckResult } from '../constants/halalFlags';
import { detectIrritants } from '../constants/irritants';

export type IngredientResult = {
  barcode: string;
  name: string | null;
  brand: string | null;
  ingredients: string[];
  halal: HalalCheckResult;
  irritants: string[];
};

interface OpenFactsIngredient {
  text?: string | null;
}

interface OpenFactsProduct {
  product_name?: string | null;
  brands?: string | null;
  ingredients?: OpenFactsIngredient[] | null;
  ingredients_text?: string | null;
}

interface OpenFactsResponse {
  status?: number;
  product?: OpenFactsProduct | null;
}

/**
 * Directly queries the Open Food/Beauty Facts API from the client as a fallback/lookup.
 * Performs local halal and irritant checks on the parsed ingredient list.
 */
export async function lookupBarcode(barcode: string): Promise<IngredientResult | null> {
  const userAgent = 'NourahApp/1.0 (https://nourah.app)';
  
  // Try Open Beauty Facts (cosmetics) first, then Open Food Facts as fallback
  const databases = [
    'world.openbeautyfacts.org',
    'world.openfoodfacts.org'
  ];

  for (const host of databases) {
    try {
      const res = await fetch(
        `https://${host}/api/v2/product/${barcode}.json`,
        { headers: { 'User-Agent': userAgent } }
      );
      
      if (res.status === 404) continue;
      if (!res.ok) continue;

      const body = (await res.json()) as OpenFactsResponse;
      if (body.status !== 1 || !body.product) continue;

      const p = body.product;
      const ingredientsRaw = p.ingredients?.map((ingredient) => ingredient.text ?? '').filter(Boolean)
        || (p.ingredients_text ? p.ingredients_text.split(/[,;]/).map((ingredient) => ingredient.trim()) : []);
      const ingredients = ingredientsRaw.map((s) => s.toLowerCase()).filter(Boolean);

      const halal = checkHalalIngredients(ingredients);
      const irritants = detectIrritants(ingredients);

      return {
        barcode,
        name: p.product_name ?? null,
        brand: p.brands ?? null,
        ingredients,
        halal,
        irritants,
      };
    } catch (err) {
      console.warn(`Local lookup failed on ${host}:`, err);
    }
  }

  return null;
}
