// Typed error envelope. Edge functions return errors as
//   { ok: false, code: 'PERFECT_CORP_DOWN', message: '...' }
// so the Expo client can branch on `code` without parsing strings.

import { corsHeaders } from './cors.ts';

export type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'BAD_REQUEST'
  | 'PERFECT_CORP_DOWN'
  | 'GEMINI_DOWN'
  | 'OPEN_FOOD_FACTS_DOWN'
  | 'NOT_FOUND'
  | 'INVALID_SIGNATURE'
  | 'INTERNAL';

export function errorResponse(
  code: ErrorCode,
  message: string,
  status = 400,
): Response {
  return new Response(
    JSON.stringify({ ok: false, code, message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}

export function okResponse<T>(data: T, status = 200): Response {
  return new Response(
    JSON.stringify({ ok: true, data }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}
