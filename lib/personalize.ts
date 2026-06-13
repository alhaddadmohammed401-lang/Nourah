// personalize — pure matcher: given a product's ingredients and the signed-in user's
// skin_type + concerns, returns two short lists ready to render in the barcode scanner
// result sheet:
//
//   - recommended[]: ingredients in the product that help concerns/skin types the user
//                    actually has.
//   - avoid[]:       ingredients in the product that aggravate concerns/skin types the
//                    user actually has.
//
// No backend calls, no AI. Cross-checks the static INGREDIENT_KNOWLEDGE map against
// substring matches on the product's already-lowercased ingredient list.

import {
  INGREDIENT_KNOWLEDGE,
  type ConcernSlug,
  type IngredientKnowledge,
} from '../constants/ingredientKnowledge';
import type { SkinType } from '../services/profileService';

export type PersonalizedMatch = {
  // The knowledge-map ingredient display name ("Niacinamide").
  name: string;
  // The matching slug list from the user's profile that this ingredient affects, so the
  // copy can say e.g. "for your oily skin" instead of just naming the ingredient.
  // Kept short — at most the first two hits — to avoid stuffing the sheet.
  matchedConcerns: ConcernSlug[];
  matchedSkinType: SkinType | null;
  reason_en: string;
  reason_ar: string;
};

export type PersonalizationResult = {
  recommended: PersonalizedMatch[];
  avoid: PersonalizedMatch[];
};

// True if any of `aliases` (already lowercase) appears as a substring of any string in
// `ingredients`. Substring matching is intentional — the OFF/OBF parser yields
// noisy strings like "alcohol denat." or "panthenol (provitamin b5)" and we want both
// to hit their canonical alias.
function ingredientPresent(ingredients: string[], aliases: string[]): boolean {
  for (const raw of ingredients) {
    const norm = raw.toLowerCase();
    for (const alias of aliases) {
      if (norm.includes(alias)) return true;
    }
  }
  return false;
}

function intersect<T>(a: readonly T[] | undefined, b: readonly T[]): T[] {
  if (!a || a.length === 0) return [];
  return a.filter((x) => b.includes(x));
}

export function personalizeIngredients(
  ingredients: string[],
  profile: { skin_type: SkinType | null; concerns: string[] } | null,
): PersonalizationResult {
  const recommended: PersonalizedMatch[] = [];
  const avoid: PersonalizedMatch[] = [];

  // With no profile, there's nothing to personalize against — return empty lists. The
  // caller will hide both sections rather than show generic content.
  if (!profile) return { recommended, avoid };

  const concerns = (profile.concerns ?? []) as ConcernSlug[];
  const skinType = profile.skin_type;

  for (const k of INGREDIENT_KNOWLEDGE) {
    if (!ingredientPresent(ingredients, k.aliases)) continue;

    const goodConcerns = intersect(k.goodFor, concerns);
    const goodSkinHit = skinType && k.goodForSkinTypes?.includes(skinType);

    const watchConcerns = intersect(k.watchForConcerns, concerns);
    const watchSkinHit = skinType && k.watchForSkinTypes?.includes(skinType);

    // Watch wins ties: if an ingredient both helps and aggravates the user (e.g.
    // salicylic acid for sensitive + oily), it goes to "Avoid" so the warning is louder.
    if (watchConcerns.length > 0 || watchSkinHit) {
      avoid.push({
        name: k.name,
        matchedConcerns: watchConcerns.slice(0, 2),
        matchedSkinType: watchSkinHit ? skinType! : null,
        reason_en: k.reason_en,
        reason_ar: k.reason_ar,
      });
      continue;
    }
    if (goodConcerns.length > 0 || goodSkinHit) {
      recommended.push({
        name: k.name,
        matchedConcerns: goodConcerns.slice(0, 2),
        matchedSkinType: goodSkinHit ? skinType! : null,
        reason_en: k.reason_en,
        reason_ar: k.reason_ar,
      });
    }
  }

  // Cap each list at 4 entries so the sheet stays scannable. The knowledge map is
  // already small but a product can legitimately match more than 4 — show the highest-
  // signal hits first (those with concrete concern matches over generic skin-type ones).
  recommended.sort((a, b) => b.matchedConcerns.length - a.matchedConcerns.length);
  avoid.sort((a, b) => b.matchedConcerns.length - a.matchedConcerns.length);

  return {
    recommended: recommended.slice(0, 3),
    avoid: avoid.slice(0, 3),
  };
}
