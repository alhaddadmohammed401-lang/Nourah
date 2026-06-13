// productService — barcode lookup against the product-lookup edge function.
// In dev / mock mode (no Supabase env vars) returns canned results so the barcode
// scanner can be exercised without hitting Open Food Facts.

import { supabase } from './supabase';

export type HalalVerdict = 'halal' | 'haram' | 'doubtful' | 'unknown';

export type ProductLookupResult = {
  barcode: string;
  name: string | null;
  brand: string | null;
  ingredients: string[];
  halal_verdict: HalalVerdict;
  flagged_ingredients: string[];
  cached: boolean;
  fetched_at: string;
};

export type ProductServiceResult = {
  data: ProductLookupResult | null;
  error: string | null;
  code?: string;
};

// Demo barcodes for mock/offline dev. Real users with Supabase env set hit the live
// product-lookup edge function and Open Food Facts.
const MOCK_PRODUCTS: Record<string, ProductLookupResult> = {
  '5901234123457': {
    barcode: '5901234123457',
    name: 'Calm Glow Hydrating Cleanser',
    brand: 'Nourah Demo',
    ingredients: ['water', 'glycerin', 'niacinamide', 'panthenol'],
    halal_verdict: 'halal',
    flagged_ingredients: [],
    cached: true,
    fetched_at: new Date().toISOString(),
  },
  '0123456789012': {
    barcode: '0123456789012',
    name: 'Bright Skin Tonic',
    brand: 'Nourah Demo',
    ingredients: ['water', 'alcohol denat', 'fragrance', 'salicylic acid'],
    halal_verdict: 'doubtful',
    flagged_ingredients: ['alcohol denat'],
    cached: true,
    fetched_at: new Date().toISOString(),
  },
};

function mockLookup(barcode: string): ProductServiceResult {
  const hit = MOCK_PRODUCTS[barcode];
  if (hit) return { data: hit, error: null };
  return { data: null, error: 'Mock: no entry for this barcode', code: 'NOT_FOUND' };
}

// supabase-js's `functions.invoke()` treats any non-2xx response from the edge function
// as an error and puts the raw Response in `error.context`, hiding the JSON body we
// returned from our `errorResponse(code, message, status)` helper. We dig the body out
// so the structured `code` (e.g. NOT_FOUND, OPEN_FOOD_FACTS_DOWN) actually reaches the
// UI and the right sheet gets shown.
async function parseInvokeError(err: unknown): Promise<{ code?: string; message: string }> {
  if (!err) return { message: 'Unknown error' };
  const ctx = (err as { context?: unknown }).context;
  if (ctx && typeof (ctx as Response).json === 'function') {
    try {
      const body = await (ctx as Response).json();
      const code = typeof body?.code === 'string' ? body.code : undefined;
      const message =
        typeof body?.message === 'string'
          ? body.message
          : (err as Error).message ?? 'Lookup failed';
      return { code, message };
    } catch {
      // body wasn't JSON; fall through
    }
  }
  return { message: (err as Error).message ?? 'Lookup failed' };
}

export async function lookupProduct(barcode: string): Promise<ProductServiceResult> {
  if (!supabase) {
    // Brief pause so the UI's loading state is observable.
    await new Promise((r) => setTimeout(r, 600));
    return mockLookup(barcode);
  }
  const { data, error } = await supabase.functions.invoke('product-lookup', {
    method: 'POST',
    body: { barcode },
  });
  if (error) {
    const parsed = await parseInvokeError(error);
    return { data: null, error: parsed.message, code: parsed.code };
  }
  if (!data?.ok) {
    return { data: null, error: data?.message ?? 'Lookup failed', code: data?.code };
  }
  return { data: data.data as ProductLookupResult, error: null };
}
