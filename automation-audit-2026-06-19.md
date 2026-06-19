# Nourah Automation Audit — 2026-06-19 (Midnight Run)

Files read: `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`

---

## Gaps
_Things the product/agent docs call for that no existing automation covers._

- **Perfect Corp quota tracking.** Free tier caps at 1,000 scans/month. No automation monitors usage or fires an alert at 80% (800 scans). You'll find out you're rate-limited when users hit it.
- **`.env` completeness check.** Morning health check verifies Git/auth/TypeScript but not whether all 6 required env vars exist and are non-empty. A missing key silently breaks a feature, not the build.
- **Translation parity check.** `en.json` and `ar.json` must stay in sync. No automation diffs their keys nightly to catch a string added in one but missing in the other.
- **Mock vs. live scan mode guard.** `EXPO_PUBLIC_SCAN_MODE` defaults to mock. No pre-build check enforces that it's set to `live` before an EAS/TestFlight build — you could ship a mock app to beta testers.
- **Supabase schema drift check.** AGENTS.md defines the exact SQL schema. No automation compares expected columns/RLS policies against the live Supabase project to catch drift from a manual change.
- **AGENTS.md checklist freshness check.** Agents are supposed to tick checklist items after every session. No automation detects whether a task was completed but the checklist was not updated, making the weekly roadmap's queue unreliable.

---

## Opportunities
_Recurring tasks or checks that would save time given where the project is headed._

- **Weekly checklist progress report.** Auto-parse AGENTS.md, count `[x]` vs `[ ]` per phase, and include a completion % in the Saturday roadmap output. Gives a one-glance status without manually counting.
- **Affiliate link health check.** `products.ts` will contain Amazon.ae / iHerb / YesStyle links. A weekly HEAD-request sweep catches dead links before they cost you commissions silently.
- **Halal flag list review reminder.** `halalFlags.ts` is a static array. A quarterly scheduled message flagging it for manual review (new ingredients, updated Islamic rulings) keeps the core differentiator accurate.
- **Supabase `raw_api_response` size alert.** The scans table stores the full Perfect Corp JSON forever. A weekly row count + estimated size check warns before storage costs grow or UAE data-retention obligations become an issue.
- **Gemini prompt smoke test.** After the 6 PM builder commits, a quick test call to `geminiService.ts` with a fixed mock input and regex-validates the JSON shape — catches prompt regressions before users see broken routines.

---

## Risks
_Stale, conflicting, or unsafe items in AGENTS.md._

- **Firebase reference in AGENTS.md is wrong.** Under "For Antigravity": *"Ideal for: scaffolding new screens, setting up Firebase services."* The project uses Supabase, not Firebase. An agent reading this could scaffold the wrong backend. Fix immediately.
- **All API keys are client-side.** `EXPO_PUBLIC_` prefix bundles every key — including the billable Gemini key and Perfect Corp key — into the app binary. Anyone who downloads the APK can extract them. The current stack has no server-side proxy. This is the highest-severity risk in the project.
- **No lock between the 6 PM builder and midnight QA.** Both automations write and commit code. If the 6 PM run leaves a broken state, midnight QA may attempt fixes and commit on top, creating a compounding conflict with no rollback trigger defined.
- **`CURRENT TASK` section is a single point of failure.** If any agent fails to update it, every subsequent agent starts from a stale task. No automation detects a mismatch between the last git commit timestamp and the last `CURRENT TASK` update timestamp.
- **App name is unconfirmed.** AGENTS.md notes: *"App Name: Nourah (placeholder — confirm before App Store submission)"* — but no task or reminder is tracking this. App Store review will reject a placeholder name if it differs from the binary. Needs an owner and a deadline.
