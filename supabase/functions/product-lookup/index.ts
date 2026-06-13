// product-lookup: given a barcode, returns product info + a halal verdict computed
// against public.halal_ingredient_rules. Caches results in public.products_cache for
// 30 days to avoid hammering Open Food Facts.
//
// Request shape:
//   GET /functions/v1/product-lookup?barcode=0123456789012
//
// Success: 200 { ok: true, data: ProductLookupResult }
// Failure: { ok: false, code, message }

import { handlePreflight } from '../_shared/cors.ts';
import { requireUserId } from '../_shared/auth.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { errorResponse, okResponse } from '../_shared/errors.ts';

const CACHE_TTL_DAYS = 30;

type HalalVerdict = 'halal' | 'haram' | 'doubtful' | 'unknown';

type ProductLookupResult = {
  barcode: string;
  name: string | null;
  brand: string | null;
  ingredients: string[];
  halal_verdict: HalalVerdict;
  flagged_ingredients: string[];
  cached: boolean;
  fetched_at: string;
};

type OffProduct = {
  status?: number;
  product?: {
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    ingredients?: { text?: string }[];
  };
};

function combineVerdict(found: { verdict: HalalVerdict }[]): HalalVerdict {
  if (found.some((f) => f.verdict === 'haram')) return 'haram';
  if (found.some((f) => f.verdict === 'doubtful')) return 'doubtful';
  if (found.length > 0 && found.every((f) => f.verdict === 'halal')) return 'halal';
  return 'unknown';
}

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  // Accept GET and POST. supabase-js's functions.invoke() defaults to POST and ignores
  // the URL query string when the body is present, so we have to read the barcode from
  // either location.
  if (req.method !== 'GET' && req.method !== 'POST') {
    return errorResponse('BAD_REQUEST', 'GET or POST required', 405);
  }

  const userId = await requireUserId(req);
  if (!userId) return errorResponse('UNAUTHENTICATED', 'Sign in required', 401);

  // First try the URL query string (the original contract). If that's empty AND the
  // method is POST, fall back to parsing the JSON body — that's how the frontend
  // client now reaches us.
  const url = new URL(req.url);
  let barcode = url.searchParams.get('barcode')?.trim();
  if (!barcode && req.method === 'POST') {
    try {
      const body = await req.json();
      const fromBody = (body as Record<string, unknown>)?.barcode;
      if (typeof fromBody === 'string') barcode = fromBody.trim();
    } catch {
      // ignore — handled by the next validation
    }
  }
  if (!barcode || !/^\d{6,14}$/.test(barcode)) {
    return errorResponse('BAD_REQUEST', 'barcode (6–14 digits) is required');
  }

  const admin = supabaseAdmin();

  // 1. Cache hit?
  const { data: cached } = await admin
    .from('products_cache')
    .select('*')
    .eq('barcode', barcode)
    .maybeSingle();
  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime();
    const ttlMs = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;
    if (ageMs < ttlMs) {
      return okResponse<ProductLookupResult>({
        barcode: cached.barcode,
        name: cached.name,
        brand: cached.brand,
        ingredients: cached.ingredients,
        halal_verdict: cached.halal_verdict,
        flagged_ingredients: cached.flagged_ingredients,
        cached: true,
        fetched_at: cached.fetched_at,
      });
    }
  }

  // 2. Hit Open Beauty Facts first (skincare/cosmetics database), then fall back to
  //    Open Food Facts. Nourah is a skincare app — most scanned barcodes are cosmetics,
  //    which live in OBF, not OFF. Both databases share the same API shape and are run
  //    by the same Open Food Facts project, so we can use the same parser for both.
  const userAgent = Deno.env.get('OPEN_FOOD_FACTS_USER_AGENT')
    ?? 'NourahApp/1.0 (https://nourah.app)';

  type FetchOutcome =
    | { kind: 'hit'; product: NonNullable<OffProduct['product']>; source: 'obf' | 'off' }
    | { kind: 'miss' }
    | { kind: 'error'; status: number };

  async function tryDatabase(host: string, source: 'obf' | 'off'): Promise<FetchOutcome> {
    try {
      const res = await fetch(
        `https://${host}/api/v2/product/${barcode}.json`,
        { headers: { 'User-Agent': userAgent } },
      );
      // 404 here means "barcode not in this database" — a miss, not a failure.
      if (res.status === 404) return { kind: 'miss' };
      if (!res.ok) return { kind: 'error', status: res.status };
      const body = (await res.json()) as OffProduct;
      // The v2 API uses status: 1 (found) / 0 (not found) inside a 200 envelope too.
      if (body.status !== 1 || !body.product) return { kind: 'miss' };
      return { kind: 'hit', product: body.product, source };
    } catch (err) {
      console.error(`${source} fetch failed`, err);
      return { kind: 'error', status: 0 };
    }
  }

  const beauty = await tryDatabase('world.openbeautyfacts.org', 'obf');
  let hit: { product: NonNullable<OffProduct['product']>; source: 'obf' | 'off' } | null =
    beauty.kind === 'hit' ? { product: beauty.product, source: beauty.source } : null;

  if (!hit) {
    const food = await tryDatabase('world.openfoodfacts.org', 'off');
    if (food.kind === 'hit') {
      hit = { product: food.product, source: food.source };
    } else if (beauty.kind === 'error' && food.kind === 'error') {
      // Both databases are unreachable — that's a service outage worth surfacing.
      return errorResponse(
        'OPEN_FOOD_FACTS_DOWN',
        `Open Beauty Facts and Open Food Facts both unreachable`,
        503,
      );
    }
  }

  if (!hit) {
    return errorResponse('NOT_FOUND', 'Barcode not in Open Beauty Facts or Open Food Facts', 404);
  }

  const p = hit.product;
  const ingredientsRaw =
    p.ingredients?.map((i) => i.text ?? '').filter(Boolean)
    ?? (p.ingredients_text ? p.ingredients_text.split(/[,;]/).map((s) => s.trim()) : []);
  const ingredients = ingredientsRaw.map((s) => s.toLowerCase()).filter(Boolean);

  // 3. Score against halal rules.
  const { data: rules } = await admin
    .from('halal_ingredient_rules')
    .select('ingredient, verdict')
    .in('ingredient', ingredients);

  const verdict = combineVerdict(rules ?? []);
  const flagged = (rules ?? [])
    .filter((r) => r.verdict === 'haram' || r.verdict === 'doubtful')
    .map((r) => r.ingredient);

  // 4. Upsert cache.
  await admin.from('products_cache').upsert({
    barcode,
    name: p.product_name ?? null,
    brand: p.brands ?? null,
    ingredients,
    halal_verdict: verdict,
    flagged_ingredients: flagged,
    fetched_at: new Date().toISOString(),
  });

  return okResponse<ProductLookupResult>({
    barcode,
    name: p.product_name ?? null,
    brand: p.brands ?? null,
    ingredients,
    halal_verdict: verdict,
    flagged_ingredients: flagged,
    cached: false,
    fetched_at: new Date().toISOString(),
  });
});
