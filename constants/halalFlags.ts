// /constants/halalFlags.ts — these ingredients trigger a "check required" badge
export const HARAM_UNCERTAIN = [
  'carmine',
  'cochineal',
  'e120',                  // Red dye from insects
  'lard',
  'tallow',                // Pig/animal fat
  'porcine collagen',
  'porcine gelatin',       // Pig-derived
  'animal-derived glycerin', // Could be pork
  'alcohol denat',         // Denatured alcohol
  'ethanol',               // If used as solvent
  'sodium stearate',       // Could be animal-derived
  'cetyl alcohol',         // If animal-derived
  'stearic acid',          // Could be animal-derived
  'oleic acid',            // Could be animal-derived
] as const;

export type HalalCheckResult = {
  verdict: 'halal_friendly' | 'check_required';
  flaggedIngredients: string[];
};

/**
 * Checks a list of lowercased ingredient names against known haram/uncertain flags.
 */
export function checkHalalIngredients(ingredients: string[]): HalalCheckResult {
  const flaggedIngredients: string[] = [];

  for (const ingredient of ingredients) {
    const lower = ingredient.toLowerCase();
    for (const flag of HARAM_UNCERTAIN) {
      if (lower.includes(flag)) {
        flaggedIngredients.push(ingredient);
        break; // Stop checking this ingredient once flagged
      }
    }
  }

  return {
    verdict: flaggedIngredients.length === 0 ? 'halal_friendly' : 'check_required',
    flaggedIngredients,
  };
}
