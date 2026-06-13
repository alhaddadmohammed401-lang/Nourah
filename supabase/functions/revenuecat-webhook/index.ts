// revenuecat-webhook: receives RevenueCat subscription events and upserts the user's
// row in public.subscriptions. Signature verified against REVENUECAT_WEBHOOK_SECRET via
// the Authorization header (RevenueCat sets it to the value you configure in their
// dashboard — see https://www.revenuecat.com/docs/webhooks).
//
// Request shape:
//   POST /functions/v1/revenuecat-webhook
//   Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>
//   { event: { type, app_user_id, entitlement_ids, expiration_at_ms, ... } }
//
// Map: INITIAL_PURCHASE | RENEWAL | UNCANCELLATION → is_premium = true
//      CANCELLATION (still active) → is_premium = true (expires later)
//      EXPIRATION | BILLING_ISSUE | TRANSFER (out) → is_premium = false

import { handlePreflight } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { errorResponse, okResponse } from '../_shared/errors.ts';

type RevenueCatEvent = {
  type:
    | 'INITIAL_PURCHASE'
    | 'RENEWAL'
    | 'UNCANCELLATION'
    | 'CANCELLATION'
    | 'EXPIRATION'
    | 'BILLING_ISSUE'
    | 'TRANSFER'
    | 'PRODUCT_CHANGE'
    | 'NON_RENEWING_PURCHASE'
    | string;
  app_user_id: string;
  original_app_user_id?: string;
  entitlement_ids?: string[];
  product_id?: string;
  expiration_at_ms?: number;
};

const ACTIVE_EVENT_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'PRODUCT_CHANGE',
  'CANCELLATION', // still active until expires_at
]);

const INACTIVE_EVENT_TYPES = new Set(['EXPIRATION', 'BILLING_ISSUE']);

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return errorResponse('BAD_REQUEST', 'POST required', 405);
  }

  // Signature: RevenueCat sends Authorization: Bearer <secret-you-configured>.
  const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  if (!secret) return errorResponse('INTERNAL', 'REVENUECAT_WEBHOOK_SECRET not set', 500);
  const auth = req.headers.get('Authorization') ?? req.headers.get('authorization');
  if (!auth || auth !== `Bearer ${secret}`) {
    return errorResponse('INVALID_SIGNATURE', 'Bad webhook signature', 401);
  }

  let body: { event?: RevenueCatEvent };
  try {
    body = await req.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'JSON body required');
  }
  const event = body.event;
  if (!event || !event.type || !event.app_user_id) {
    return errorResponse('BAD_REQUEST', 'event.{type, app_user_id} required');
  }

  // app_user_id is the Supabase user uuid (we configure RevenueCat to pass this through
  // when initializing their SDK in the Expo app).
  const userId = event.app_user_id;

  const isActive = ACTIVE_EVENT_TYPES.has(event.type)
    && !INACTIVE_EVENT_TYPES.has(event.type);

  const admin = supabaseAdmin();
  const { error } = await admin.from('subscriptions').upsert({
    user_id: userId,
    revenuecat_user_id: event.original_app_user_id ?? userId,
    is_premium: isActive,
    entitlement: event.entitlement_ids?.[0] ?? event.product_id ?? null,
    expires_at: event.expiration_at_ms
      ? new Date(event.expiration_at_ms).toISOString()
      : null,
    last_event: event.type,
  }, { onConflict: 'user_id' });

  if (error) {
    console.error('subscriptions upsert failed', error);
    return errorResponse('INTERNAL', error.message, 500);
  }

  return okResponse({ user_id: userId, is_premium: isActive, event: event.type });
});
