// ingredientKnowledge — a small, conservative skincare ingredient map used by the
// product barcode scanner to personalize results against the signed-in user's profile
// (skin_type + concerns). Pure data, no backend calls.
//
// Editorial rules:
//   1. Only well-established dermatology consensus. No fad ingredients.
//   2. Every entry pairs a SHORT clinical phrase (EN + AR) with an explicit list of
//      concern slugs / skin types it helps (goodFor) or aggravates (watchFor).
//   3. `aliases` MUST be lowercase and cover the common INCI spellings the ingredient
//      can appear under in Open Beauty Facts / Open Food Facts.
//
// The matcher (lib/personalize.ts) substring-checks each alias against each lowercased
// ingredient string returned by the product-lookup edge function — so aliases of
// "alcohol denat" will hit "alcohol denat.", "alcohol denat (40b)", etc.

import type { SkinType } from '../services/profileService';

// The concern slugs come from app/(onboarding)/concerns.tsx and are also what we expect
// to find in public.profiles.concerns. Keep the union in sync if onboarding adds more.
export type ConcernSlug =
  | 'acne'
  | 'pigmentation'
  | 'oily_skin'
  | 'dryness'
  | 'damaged_barrier'
  | 'sun_damage'
  | 'large_pores'
  | 'sensitivity';

export type IngredientKnowledge = {
  // Display name, used in the result sheet copy. Title-cased English form.
  name: string;
  // Lowercased substrings to match against the product's ingredient list. Cover INCI
  // synonyms and common Arabic transliterations where applicable.
  aliases: string[];
  // Concerns this ingredient is established to help (the user has the concern → match).
  goodFor?: ConcernSlug[];
  // Skin types this ingredient suits (the user has this skin type → match).
  goodForSkinTypes?: SkinType[];
  // Concerns / skin types this ingredient can aggravate (→ "Avoid" section).
  watchForConcerns?: ConcernSlug[];
  watchForSkinTypes?: SkinType[];
  // Short clinical reason shown to the user, both locales. One short clause, no fluff.
  reason_en: string;
  reason_ar: string;
};

export const INGREDIENT_KNOWLEDGE: IngredientKnowledge[] = [
  // — Hydrators / barrier support —
  {
    name: 'Niacinamide',
    aliases: ['niacinamide', 'nicotinamide'],
    goodFor: ['oily_skin', 'large_pores', 'sensitivity', 'pigmentation', 'damaged_barrier'],
    goodForSkinTypes: ['oily', 'combination', 'sensitive'],
    reason_en: 'Calms redness and helps regulate oil',
    reason_ar: 'يهدئ الاحمرار ويساعد على ضبط الزيوت',
  },
  {
    name: 'Hyaluronic acid',
    aliases: ['hyaluronic acid', 'sodium hyaluronate', 'hyaluronate'],
    goodFor: ['dryness', 'damaged_barrier'],
    goodForSkinTypes: ['dry', 'normal', 'combination', 'sensitive'],
    reason_en: 'Pulls water into the skin',
    reason_ar: 'يساعد على ترطيب البشرة',
  },
  {
    name: 'Glycerin',
    aliases: ['glycerin', 'glycerine', 'glycerol'],
    goodFor: ['dryness', 'damaged_barrier'],
    goodForSkinTypes: ['dry', 'normal', 'sensitive'],
    reason_en: 'A gentle humectant for everyday hydration',
    reason_ar: 'مرطب لطيف للاستخدام اليومي',
  },
  {
    name: 'Panthenol',
    aliases: ['panthenol', 'provitamin b5', 'd-panthenol'],
    goodFor: ['damaged_barrier', 'sensitivity', 'dryness'],
    goodForSkinTypes: ['sensitive', 'dry'],
    reason_en: 'Soothes and helps the barrier recover',
    reason_ar: 'يهدئ ويدعم حاجز البشرة',
  },
  {
    name: 'Ceramides',
    aliases: ['ceramide', 'ceramides'],
    goodFor: ['damaged_barrier', 'dryness', 'sensitivity'],
    goodForSkinTypes: ['dry', 'sensitive'],
    reason_en: 'Rebuilds the skin’s barrier',
    reason_ar: 'يعيد بناء حاجز البشرة',
  },
  {
    name: 'Squalane',
    aliases: ['squalane', 'squalene'],
    goodFor: ['dryness', 'damaged_barrier'],
    goodForSkinTypes: ['dry', 'sensitive', 'normal'],
    reason_en: 'A light, non-greasy moisturizer',
    reason_ar: 'مرطب خفيف غير دهني',
  },
  {
    name: 'Centella asiatica',
    aliases: ['centella asiatica', 'cica', 'madecassoside'],
    goodFor: ['sensitivity', 'damaged_barrier'],
    goodForSkinTypes: ['sensitive', 'dry'],
    reason_en: 'Calms reactive, easily flushed skin',
    reason_ar: 'يهدئ البشرة الحساسة وسريعة الاحمرار',
  },
  {
    name: 'Allantoin',
    aliases: ['allantoin'],
    goodFor: ['sensitivity', 'damaged_barrier'],
    goodForSkinTypes: ['sensitive'],
    reason_en: 'Quietly soothes irritation',
    reason_ar: 'يهدئ التهيج بلطف',
  },

  // — Actives —
  {
    name: 'Salicylic acid',
    aliases: ['salicylic acid', 'bha'],
    goodFor: ['acne', 'large_pores', 'oily_skin'],
    goodForSkinTypes: ['oily', 'combination'],
    watchForSkinTypes: ['sensitive', 'dry'],
    reason_en: 'Unclogs pores and reduces breakouts',
    reason_ar: 'ينظف المسام ويقلل الحبوب',
  },
  {
    name: 'Benzoyl peroxide',
    aliases: ['benzoyl peroxide'],
    goodFor: ['acne'],
    goodForSkinTypes: ['oily', 'combination'],
    watchForSkinTypes: ['sensitive', 'dry'],
    watchForConcerns: ['damaged_barrier', 'sensitivity'],
    reason_en: 'Targets active breakouts; can be drying',
    reason_ar: 'يستهدف الحبوب النشطة، وقد يسبب الجفاف',
  },
  {
    name: 'Azelaic acid',
    aliases: ['azelaic acid'],
    goodFor: ['acne', 'pigmentation', 'sensitivity'],
    goodForSkinTypes: ['sensitive', 'combination', 'oily'],
    reason_en: 'Treats breakouts and uneven tone, sensitive-friendly',
    reason_ar: 'يعالج الحبوب وتفاوت اللون، ومناسب للبشرة الحساسة',
  },
  {
    name: 'Retinol',
    aliases: ['retinol', 'retinal', 'retinaldehyde', 'retinyl palmitate', 'retinyl', 'tretinoin', 'adapalene'],
    goodFor: ['acne', 'pigmentation', 'sun_damage'],
    goodForSkinTypes: ['oily', 'combination', 'normal'],
    watchForSkinTypes: ['sensitive'],
    watchForConcerns: ['sensitivity', 'damaged_barrier'],
    reason_en: 'Resurfaces skin; introduce slowly',
    reason_ar: 'يجدد سطح البشرة، ابدئي تدريجيا',
  },
  {
    name: 'Vitamin C',
    aliases: ['ascorbic acid', 'l-ascorbic acid', 'sodium ascorbyl phosphate', 'magnesium ascorbyl phosphate', 'ascorbyl glucoside', 'ethyl ascorbic acid', 'tetrahexyldecyl ascorbate'],
    goodFor: ['pigmentation', 'sun_damage'],
    goodForSkinTypes: ['normal', 'combination', 'oily'],
    watchForSkinTypes: ['sensitive'],
    reason_en: 'Brightens and protects from daily damage',
    reason_ar: 'يفتح البشرة ويحميها من التلف اليومي',
  },
  {
    name: 'Glycolic acid',
    aliases: ['glycolic acid'],
    goodFor: ['pigmentation', 'sun_damage', 'large_pores'],
    goodForSkinTypes: ['normal', 'combination', 'oily'],
    watchForSkinTypes: ['sensitive', 'dry'],
    watchForConcerns: ['sensitivity', 'damaged_barrier'],
    reason_en: 'A strong exfoliant; not for compromised skin',
    reason_ar: 'مقشر قوي، غير مناسب للبشرة المتضررة',
  },
  {
    name: 'Lactic acid',
    aliases: ['lactic acid'],
    goodFor: ['pigmentation', 'dryness'],
    goodForSkinTypes: ['dry', 'normal'],
    watchForSkinTypes: ['sensitive'],
    reason_en: 'A milder AHA, also lightly hydrating',
    reason_ar: 'حمض ألفا هيدروكسي لطيف وله أثر مرطب',
  },
  {
    name: 'Tranexamic acid',
    aliases: ['tranexamic acid'],
    goodFor: ['pigmentation'],
    goodForSkinTypes: ['sensitive', 'normal', 'combination', 'oily', 'dry'],
    reason_en: 'Helps fade dark spots, gentle option',
    reason_ar: 'يساعد على تخفيف البقع الداكنة بلطف',
  },

  // — Sunscreen actives —
  {
    name: 'Zinc oxide',
    aliases: ['zinc oxide'],
    goodFor: ['sun_damage', 'sensitivity', 'pigmentation'],
    goodForSkinTypes: ['sensitive', 'normal', 'dry'],
    reason_en: 'Mineral sunscreen, kind to reactive skin',
    reason_ar: 'واقي شمسي معدني، لطيف على البشرة الحساسة',
  },
  {
    name: 'Titanium dioxide',
    aliases: ['titanium dioxide'],
    goodFor: ['sun_damage', 'sensitivity'],
    goodForSkinTypes: ['sensitive', 'normal', 'dry'],
    reason_en: 'Mineral UV filter, low irritation',
    reason_ar: 'فلتر معدني للأشعة، نادرا ما يهيج البشرة',
  },

  // — Watch-out ingredients —
  {
    name: 'Denatured alcohol',
    aliases: ['alcohol denat', 'alcohol denat.', 'denatured alcohol', 'sd alcohol'],
    watchForConcerns: ['dryness', 'sensitivity', 'damaged_barrier'],
    watchForSkinTypes: ['dry', 'sensitive'],
    reason_en: 'Can dry out and disrupt the barrier',
    reason_ar: 'قد يجفف ويضعف حاجز البشرة',
  },
  {
    name: 'Fragrance',
    aliases: ['fragrance', 'parfum', 'perfume'],
    watchForConcerns: ['sensitivity', 'damaged_barrier'],
    watchForSkinTypes: ['sensitive'],
    reason_en: 'A common trigger for reactive skin',
    reason_ar: 'من المهيجات الشائعة للبشرة الحساسة',
  },
  {
    name: 'Essential oils',
    aliases: ['essential oil', 'limonene', 'linalool', 'citronellol', 'geraniol', 'eugenol'],
    watchForConcerns: ['sensitivity', 'damaged_barrier'],
    watchForSkinTypes: ['sensitive'],
    reason_en: 'Naturally fragrant but can irritate',
    reason_ar: 'عطرية طبيعيا لكنها قد تهيج البشرة',
  },
  {
    name: 'Menthol',
    aliases: ['menthol'],
    watchForConcerns: ['sensitivity', 'damaged_barrier'],
    watchForSkinTypes: ['sensitive'],
    reason_en: 'Cooling effect, often irritating long-term',
    reason_ar: 'يعطي إحساسا منعشا لكنه قد يهيج البشرة على المدى البعيد',
  },
  {
    name: 'Sodium lauryl sulfate',
    aliases: ['sodium lauryl sulfate', 'sls'],
    watchForConcerns: ['dryness', 'sensitivity', 'damaged_barrier'],
    watchForSkinTypes: ['dry', 'sensitive'],
    reason_en: 'A harsh cleansing agent for delicate skin',
    reason_ar: 'منظف قوي قد لا يناسب البشرة الرقيقة',
  },
  {
    name: 'Coconut oil',
    aliases: ['cocos nucifera oil', 'coconut oil'],
    watchForConcerns: ['acne', 'large_pores'],
    watchForSkinTypes: ['oily', 'combination'],
    reason_en: 'Pore-clogging for breakout-prone skin',
    reason_ar: 'قد يسد المسام للبشرة المعرضة للحبوب',
  },
  {
    name: 'Isopropyl myristate',
    aliases: ['isopropyl myristate'],
    watchForConcerns: ['acne', 'large_pores'],
    watchForSkinTypes: ['oily', 'combination'],
    reason_en: 'Can clog pores for oily skin',
    reason_ar: 'قد يسد مسام البشرة الدهنية',
  },
  {
    name: 'Witch hazel',
    aliases: ['hamamelis virginiana', 'witch hazel'],
    watchForConcerns: ['sensitivity', 'damaged_barrier', 'dryness'],
    watchForSkinTypes: ['sensitive', 'dry'],
    reason_en: 'Astringent; can be drying for delicate skin',
    reason_ar: 'قابض، قد يسبب الجفاف للبشرة الرقيقة',
  },
];
