// /constants/irritants.ts — known skin irritants and sensitizing ingredients
export const KNOWN_IRRITANTS = [
  'alcohol denat',
  'alcohol denat.',
  'denatured alcohol',
  'sd alcohol',
  'fragrance',
  'parfum',
  'perfume',
  'essential oil',
  'limonene',
  'linalool',
  'citronellol',
  'geraniol',
  'eugenol',
  'menthol',
  'sodium lauryl sulfate',
  'sls',
  'witch hazel',
  'hamamelis virginiana',
] as const;

/**
 * Detects known skin irritants in a list of ingredient names.
 */
export function detectIrritants(ingredients: string[]): string[] {
  const flagged: string[] = [];

  for (const ingredient of ingredients) {
    const lower = ingredient.toLowerCase();
    for (const irritant of KNOWN_IRRITANTS) {
      if (lower.includes(irritant)) {
        flagged.push(ingredient);
        break;
      }
    }
  }

  return flagged;
}
