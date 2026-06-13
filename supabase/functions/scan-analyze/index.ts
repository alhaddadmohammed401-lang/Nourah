// scan-analyze (async kick-off).
//
// Receives a base64 face image, registers it with YouCam, uploads it, starts the
// skin-analysis task, inserts a 'pending' row in public.scans with the task_id, and
// returns the row immediately. The client navigates back to Home, where useLatestScan
// polls scan-status until YouCam finishes.
//
// Request shape:
//   POST /functions/v1/scan-analyze
//   { image_base64: string }
//
// Success: 200 { ok: true, data: PendingScan }   // status === 'pending'
// Failure: { ok: false, code, message }

import { handlePreflight } from '../_shared/cors.ts';
import { requireUserId } from '../_shared/auth.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { errorResponse, okResponse } from '../_shared/errors.ts';

const YOUCAM_BASE = 'https://yce-api-01.makeupar.com';
// Trimmed to two essentials for MVP. See scan-status for how these map to score columns.
const DST_ACTIONS = ['pore', 'oiliness'];

function decodeBase64Image(input: string): { bytes: Uint8Array; contentType: string } {
  let contentType = 'image/jpeg';
  let b64 = input;
  const match = input.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/);
  if (match) {
    contentType = match[1];
    b64 = match[2];
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, contentType };
}

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return errorResponse('BAD_REQUEST', 'POST required', 405);
  }

  const userId = await requireUserId(req);
  if (!userId) return errorResponse('UNAUTHENTICATED', 'Sign in required', 401);

  let body: { image_base64?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse('BAD_REQUEST', 'JSON body required');
  }
  if (!body.image_base64 || typeof body.image_base64 !== 'string') {
    return errorResponse('BAD_REQUEST', 'image_base64 (string) is required');
  }

  const apiKey = Deno.env.get('PERFECT_CORP_KEY');
  if (!apiKey) return errorResponse('INTERNAL', 'PERFECT_CORP_KEY secret not set', 500);

  let imageBytes: Uint8Array;
  let contentType: string;
  try {
    const decoded = decodeBase64Image(body.image_base64);
    imageBytes = decoded.bytes;
    contentType = decoded.contentType;
  } catch (err) {
    console.error('base64 decode failed', err);
    return errorResponse('BAD_REQUEST', 'image_base64 is not valid base64');
  }

  // Step 1: register the upload with YouCam.
  let fileId: string;
  let uploadUrl: string;
  let uploadHeaders: Record<string, string> = {};
  try {
    const fileRes = await fetch(`${YOUCAM_BASE}/s2s/v2.0/file/skin-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        files: [{
          content_type: contentType,
          file_name: `scan-${Date.now()}.jpg`,
          file_size: imageBytes.byteLength,
        }],
      }),
    });
    if (!fileRes.ok) {
      const text = await fileRes.text();
      console.error('YouCam file step non-2xx', fileRes.status, text);
      return errorResponse(
        'PERFECT_CORP_DOWN',
        `YouCam file step ${fileRes.status}: ${text.slice(0, 200)}`,
        503,
      );
    }
    const fileBody = await fileRes.json();
    const first =
      fileBody?.data?.files?.[0] ?? fileBody?.result?.files?.[0] ?? fileBody?.files?.[0];
    fileId = first?.file_id ?? first?.id;
    uploadUrl = first?.upload_url ?? first?.requests?.[0]?.url;
    uploadHeaders = first?.requests?.[0]?.headers ?? {};
    if (!fileId || !uploadUrl) {
      console.error('YouCam file step missing fields', JSON.stringify(fileBody));
      return errorResponse('PERFECT_CORP_DOWN', 'YouCam file response malformed', 503);
    }
  } catch (err) {
    console.error('YouCam file step fetch failed', err);
    return errorResponse('PERFECT_CORP_DOWN', 'Could not reach YouCam (file step)', 503);
  }

  // Step 2: PUT image bytes to the pre-signed URL.
  try {
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: Object.keys(uploadHeaders).length ? uploadHeaders : { 'Content-Type': contentType },
      body: imageBytes,
    });
    if (!putRes.ok) {
      console.error('YouCam upload PUT non-2xx', putRes.status, await putRes.text());
      return errorResponse('PERFECT_CORP_DOWN', `Upload PUT ${putRes.status}`, 503);
    }
  } catch (err) {
    console.error('YouCam upload PUT fetch failed', err);
    return errorResponse('PERFECT_CORP_DOWN', 'Could not upload image to YouCam', 503);
  }

  // Step 3: kick off the analysis task. We DON'T poll here — scan-status owns that.
  let taskId: string;
  try {
    const taskRes = await fetch(`${YOUCAM_BASE}/s2s/v2.0/task/skin-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        src_file_id: fileId,
        dst_actions: DST_ACTIONS,
        format: 'json',
      }),
    });
    if (!taskRes.ok) {
      const text = await taskRes.text();
      console.error('YouCam task step non-2xx', taskRes.status, text);
      return errorResponse(
        'PERFECT_CORP_DOWN',
        `YouCam task step ${taskRes.status}: ${text.slice(0, 200)}`,
        503,
      );
    }
    const taskBody = await taskRes.json();
    taskId = taskBody?.data?.task_id ?? taskBody?.result?.task_id ?? taskBody?.task_id;
    if (!taskId) {
      console.error('YouCam task step missing task_id', JSON.stringify(taskBody));
      return errorResponse('PERFECT_CORP_DOWN', 'YouCam task response malformed', 503);
    }
  } catch (err) {
    console.error('YouCam task step fetch failed', err);
    return errorResponse('PERFECT_CORP_DOWN', 'Could not start YouCam analysis', 503);
  }

  // Insert the pending row and return immediately.
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from('scans')
    .insert({ user_id: userId, status: 'pending', task_id: taskId })
    .select()
    .single();

  if (error) {
    console.error('scans insert failed', error);
    return errorResponse('INTERNAL', error.message, 500);
  }

  return okResponse(data);
});
