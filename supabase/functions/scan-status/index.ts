// scan-status (async poll).
//
// Given a scan_id whose row is currently status='pending', this function calls YouCam
// ONCE for its task status. If YouCam reports success it parses the scores, updates
// the scan row to status='complete' with real numbers, and returns the row. If YouCam
// is still running it returns the row unchanged so the client knows to poll again. If
// YouCam errored it flips status='failed' and stores the error.
//
// Request shape:
//   POST /functions/v1/scan-status
//   { scan_id: string }
//
// Success: 200 { ok: true, data: Scan }  // status may be pending | complete | failed
// Failure: { ok: false, code, message }

import { handlePreflight } from '../_shared/cors.ts';
import { requireUserId } from '../_shared/auth.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { errorResponse, okResponse } from '../_shared/errors.ts';

const YOUCAM_BASE = 'https://yce-api-01.makeupar.com';

function poreBucket(score: number): 'small' | 'medium' | 'large' {
  if (score >= 7) return 'small';
  if (score >= 4) return 'medium';
  return 'large';
}

function bandFromScore(score: number): 'green' | 'amber' | 'red' {
  if (score >= 70) return 'green';
  if (score >= 40) return 'amber';
  return 'red';
}

function routineFromOiliness(oiliness: number): 'oily' | 'dry' | 'combination' {
  if (oiliness >= 7) return 'oily';
  if (oiliness <= 3) return 'dry';
  return 'combination';
}

function gccFlagsFor(scores: Record<string, number>): string[] {
  const flags = ['high_uv'];
  if ((scores.oiliness ?? 0) > 6) flags.push('humidity_warning');
  if ((scores.age_spot ?? 0) > 5) flags.push('melasma_risk');
  return flags;
}

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return errorResponse('BAD_REQUEST', 'POST required', 405);
  }

  const userId = await requireUserId(req);
  if (!userId) return errorResponse('UNAUTHENTICATED', 'Sign in required', 401);

  let body: { scan_id?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'JSON body required');
  }
  if (!body.scan_id) return errorResponse('BAD_REQUEST', 'scan_id is required');

  const apiKey = Deno.env.get('PERFECT_CORP_KEY');
  if (!apiKey) return errorResponse('INTERNAL', 'PERFECT_CORP_KEY secret not set', 500);

  const admin = supabaseAdmin();

  // Fetch the scan row (must belong to this user; otherwise it stays invisible).
  const { data: scan, error: scanErr } = await admin
    .from('scans')
    .select('*')
    .eq('id', body.scan_id)
    .eq('user_id', userId)
    .maybeSingle();
  if (scanErr) return errorResponse('INTERNAL', scanErr.message, 500);
  if (!scan) return errorResponse('NOT_FOUND', 'scan not found', 404);

  // Already finalised? Just return what we have.
  if (scan.status !== 'pending') return okResponse(scan);
  if (!scan.task_id) {
    return errorResponse('INTERNAL', 'pending scan has no task_id', 500);
  }

  // Ask YouCam once.
  let body2: Record<string, unknown>;
  try {
    const res = await fetch(`${YOUCAM_BASE}/s2s/v2.0/task/skin-analysis/${scan.task_id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      console.error('YouCam poll non-2xx', res.status, await res.text());
      // Don't flip to failed on a transient error — let the client try again.
      return okResponse(scan);
    }
    body2 = await res.json();
  } catch (err) {
    console.error('YouCam poll fetch failed', err);
    return okResponse(scan);
  }

  const inner = (body2?.data ?? body2?.result ?? body2) as Record<string, unknown>;
  // YouCam's response uses task_status (observed). Older docs/specs reference status —
  // accept both so we don't get stuck in a parser-disagreement loop.
  const status = (inner?.task_status ?? inner?.status) as string | undefined;

  if (status === 'running' || status === 'pending') {
    return okResponse(scan); // still cooking
  }

  if (status === 'error' || status === 'failed') {
    const message = (inner?.error as string | undefined) ?? 'YouCam task failed';
    const { data: updated } = await admin
      .from('scans')
      .update({ status: 'failed', error: message })
      .eq('id', scan.id)
      .select()
      .single();
    return okResponse(updated ?? scan);
  }

  if (status !== 'success') {
    // Unknown state — return as pending and let the client re-poll.
    console.warn('YouCam unknown status', status, JSON.stringify(inner));
    return okResponse(scan);
  }

  // Success. Parse scores.
  const rawScores: Record<string, number> = {};
  const arr = inner.results;
  if (Array.isArray(arr)) {
    for (const item of arr) {
      const action =
        (item as Record<string, unknown>).action ?? (item as Record<string, unknown>).type;
      const score =
        (item as Record<string, unknown>).score ?? (item as Record<string, unknown>).value;
      if (typeof action === 'string' && typeof score === 'number') {
        rawScores[action] = score;
      }
    }
  }
  console.log('YouCam rawScores', JSON.stringify(rawScores));

  const oiliness = rawScores.oiliness ?? 5;
  const hydrationScore = Math.round(Math.max(0, Math.min(10, 10 - oiliness)) * 10);
  const ageSpot = rawScores.age_spot ?? 0;
  const pigmentation = Math.round(ageSpot * 10);
  const acneRaw = rawScores.acne ?? 0;
  const acneCount = Math.max(0, Math.round(acneRaw * 1.5));
  const present = Object.values(rawScores).filter((n) => typeof n === 'number');
  const overall = present.length
    ? Math.round((present.reduce((a, b) => a + b, 0) / present.length) * 10)
    : 50;

  const { data: updated, error: updateErr } = await admin
    .from('scans')
    .update({
      status: 'complete',
      hydration_score: hydrationScore,
      pores_score: poreBucket(rawScores.pore ?? 5),
      pigmentation_score: pigmentation,
      acne_count: acneCount,
      overall_score: overall,
      band: bandFromScore(overall),
      gcc_flags: gccFlagsFor(rawScores),
      routine_type: routineFromOiliness(oiliness),
    })
    .eq('id', scan.id)
    .select()
    .single();

  if (updateErr) {
    console.error('scans update failed', updateErr);
    return errorResponse('INTERNAL', updateErr.message, 500);
  }

  return okResponse(updated);
});
