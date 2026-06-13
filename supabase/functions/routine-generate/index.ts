// routine-generate: builds (and caches) an AM/PM skincare routine for the user's latest
// scan via Gemini Flash. Reads scan + profile (skin type, concerns) from Postgres, asks
// Gemini for structured output, persists the result to public.routines, returns it.
//
// Request shape:
//   POST /functions/v1/routine-generate
//   { scan_id?: string }   -- optional; defaults to the user's most recent scan
//
// Success: 200 { ok: true, data: RoutinePlan }
// Failure: { ok: false, code: 'GEMINI_DOWN' | 'NOT_FOUND' | ..., message }

import { handlePreflight } from '../_shared/cors.ts';
import { requireUserId } from '../_shared/auth.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { errorResponse, okResponse } from '../_shared/errors.ts';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type RoutineStep = {
  id: string;
  timeOfDay: 'am' | 'pm';
  stepNumber: number;
  title_en: string;
  title_ar: string;
  why_en: string;
  why_ar: string;
};

type RoutinePlan = {
  isPremium: boolean;
  skinBand: 'green' | 'amber' | 'red';
  bandGlyph: string;
  amSteps: RoutineStep[];
  pmSteps: RoutineStep[];
};

const ROUTINE_SCHEMA = {
  type: 'object',
  properties: {
    amSteps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          stepNumber: { type: 'integer' },
          title_en: { type: 'string' },
          title_ar: { type: 'string' },
          why_en: { type: 'string' },
          why_ar: { type: 'string' },
        },
        required: ['id', 'stepNumber', 'title_en', 'title_ar', 'why_en', 'why_ar'],
      },
    },
    pmSteps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          stepNumber: { type: 'integer' },
          title_en: { type: 'string' },
          title_ar: { type: 'string' },
          why_en: { type: 'string' },
          why_ar: { type: 'string' },
        },
        required: ['id', 'stepNumber', 'title_en', 'title_ar', 'why_en', 'why_ar'],
      },
    },
  },
  required: ['amSteps', 'pmSteps'],
};

function bandGlyph(band: 'green' | 'amber' | 'red'): string {
  return band === 'green' ? '✓' : band === 'amber' ? '!' : '✗';
}

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return errorResponse('BAD_REQUEST', 'POST required', 405);
  }

  const userId = await requireUserId(req);
  if (!userId) return errorResponse('UNAUTHENTICATED', 'Sign in required', 401);

  let body: { scan_id?: string } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is allowed
  }

  const admin = supabaseAdmin();

  // 1. Resolve scan: either the provided scan_id or the user's latest scan.
  const scanQuery = admin
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  const { data: scans, error: scanErr } = body.scan_id
    ? await admin.from('scans').select('*').eq('id', body.scan_id).eq('user_id', userId).limit(1)
    : await scanQuery;
  if (scanErr) return errorResponse('INTERNAL', scanErr.message, 500);
  if (!scans || scans.length === 0) {
    return errorResponse('NOT_FOUND', 'No scan found for user', 404);
  }
  const scan = scans[0];

  // 2. Check cache.
  const { data: cached, error: cachedErr } = await admin
    .from('routines')
    .select('*')
    .eq('user_id', userId)
    .eq('scan_id', scan.id)
    .maybeSingle();
  if (cachedErr && cachedErr.code !== 'PGRST116') {
    return errorResponse('INTERNAL', cachedErr.message, 500);
  }

  // 3. Resolve premium flag from subscriptions table.
  const { data: sub } = await admin
    .from('subscriptions')
    .select('is_premium')
    .eq('user_id', userId)
    .maybeSingle();
  const isPremium = !!sub?.is_premium;

  if (cached) {
    const plan: RoutinePlan = {
      isPremium,
      skinBand: cached.skin_band,
      bandGlyph: bandGlyph(cached.skin_band),
      amSteps: cached.am_steps as RoutineStep[],
      pmSteps: cached.pm_steps as RoutineStep[],
    };
    return okResponse(plan);
  }

  // 4. Pull profile (skin type, concerns) for prompt context.
  const { data: profile } = await admin
    .from('profiles')
    .select('skin_type, concerns, locale')
    .eq('id', userId)
    .maybeSingle();

  // 5. Call Gemini.
  const geminiKey = Deno.env.get('GEMINI_KEY');
  if (!geminiKey) return errorResponse('INTERNAL', 'GEMINI_KEY secret not set', 500);

  const prompt = `You are a dermatologist-trained skincare AI for GCC-region women. Build a personalized AM and PM skincare routine.

User profile:
- Skin type: ${profile?.skin_type ?? scan.routine_type}
- Concerns: ${(profile?.concerns ?? []).join(', ') || 'none specified'}
- Locale preference: ${profile?.locale ?? 'ar'}

Latest scan:
- Hydration: ${scan.hydration_score}/100
- Pores: ${scan.pores_score}
- Pigmentation: ${scan.pigmentation_score}/100
- Acne count: ${scan.acne_count}
- Overall score: ${scan.overall_score}/100 (band: ${scan.band})
- GCC flags: ${scan.gcc_flags.join(', ')}

Return a JSON object with amSteps (3 steps) and pmSteps (3 steps). Each step has:
- id: kebab-case identifier like "am-cleanse"
- stepNumber: 1, 2, or 3
- title_en, title_ar: short step name in English and Arabic
- why_en, why_ar: one-sentence justification tied to this scan's findings, in English and Arabic

Use halal-acceptable ingredient recommendations (avoid alcohol-heavy formulations, animal-derived ingredients without source verification).`;

  let geminiBody: { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  try {
    const gRes = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: ROUTINE_SCHEMA,
        },
      }),
    });
    if (!gRes.ok) {
      console.error('Gemini non-2xx', gRes.status, await gRes.text());
      return errorResponse('GEMINI_DOWN', `Gemini returned ${gRes.status}`, 503);
    }
    geminiBody = await gRes.json();
  } catch (err) {
    console.error('Gemini fetch failed', err);
    return errorResponse('GEMINI_DOWN', 'Could not reach Gemini', 503);
  }

  const text = geminiBody.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return errorResponse('GEMINI_DOWN', 'Empty Gemini response', 503);

  let parsed: { amSteps: RoutineStep[]; pmSteps: RoutineStep[] };
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error('Gemini JSON parse failed', err, text);
    return errorResponse('GEMINI_DOWN', 'Gemini returned non-JSON', 503);
  }

  // Stamp timeOfDay (Gemini doesn't need to set it since AM/PM is implied by the array).
  const amSteps = parsed.amSteps.map((s) => ({ ...s, timeOfDay: 'am' as const }));
  const pmSteps = parsed.pmSteps.map((s) => ({ ...s, timeOfDay: 'pm' as const }));

  // 6. Persist to cache.
  const { error: insertErr } = await admin.from('routines').insert({
    user_id: userId,
    scan_id: scan.id,
    am_steps: amSteps,
    pm_steps: pmSteps,
    skin_band: scan.band,
    is_premium: isPremium,
  });
  if (insertErr) {
    console.error('routines insert failed', insertErr);
    // Don't fail the request — we already have a valid plan to return.
  }

  const plan: RoutinePlan = {
    isPremium,
    skinBand: scan.band,
    bandGlyph: bandGlyph(scan.band),
    amSteps,
    pmSteps,
  };
  return okResponse(plan);
});
