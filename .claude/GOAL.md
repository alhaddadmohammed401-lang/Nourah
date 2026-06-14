# Goal: Stage 3 — Dark mode

**Status:** active

## Outcome

A user can switch the app between **Light** (current Soft Blush surface, unchanged
from Stage 2) and **Warm Dark** (brand-tinted near-black) via a toggle in
**Profile → Appearance**. The system preference is auto-detected on first
launch; the user's manual choice (Light / Dark / System) persists across
sessions in AsyncStorage. Every screen — Home, Scan, Products, Profile, all
sub-routes (`scan-product`, `scan-history`, onboarding, auth) — renders
intentionally in both themes. Brand identity holds across themes: DM Serif
Display, Brand Rose `#E8637A` accent, gold `#C9A84C` premium nudge stay
recognizable; only surface and ink colors swap.

## Verification surface

1. **Manual sweep** — open Profile → Appearance → toggle Light/Dark/System.
   Every visible screen transitions smoothly, no flash of wrong colors, no
   unreadable text anywhere.
2. **Side-by-side snapshots** — each screen has both light and dark captures
   that look *designed*, not auto-inverted.
3. **System mode** — set the toggle to "System", flip the browser's
   `prefers-color-scheme` (devtools → Rendering → Emulate CSS media feature),
   app flips live without restart.
4. **Persistence** — set Dark, reload the app, app loads in Dark.
5. **Contrast check** — Brand Rose CTAs and body text both pass WCAG AA on the
   warm-dark surface (≥4.5:1 for body, ≥3:1 for large text).

## Constraints

- **Backend frozen.** No schema, no edge function, no migration changes.
- **No regressions to Stage 1 polish in light mode** — typography, spacing,
  layout, color usage must look identical to today when in Light.
- **Stage 2 features all work in dark mode** — barcode scanner result sheet
  (incl. Recommended / Avoid personalization sections), scan history rows,
  routine streak strip, profile stats, OAuth screens, onboarding.
- **No new top-level dependencies.** NativeWind's class-based dark mode plus a
  React Context for theme state is enough.
- **Mock mode keeps working** — dev without Supabase env still toggles themes
  correctly. Theme state lives in AsyncStorage, not the user's profile.

## Warm-dark palette (locked)

| Role | Light (today) | Warm Dark |
|---|---|---|
| Surface (page) | `#F9E8E8` Soft Blush | `#1A0F1B` |
| Card / elevated | `#FFFFFF` | `#261A28` |
| Ink primary | `#2D1B2E` Deep Mauve | `#F2E2E5` |
| Ink secondary / eyebrow | `#5A5A5A` Dark Gray | `#D4A0A7` Dusty Pink |
| Brand Rose accent | `#E8637A` | `#E8637A` (unchanged) |
| Gold premium nudge | `#C9A84C` | `#C9A84C` (unchanged) |
| Hairline border | `rgba(212,160,167,0.45)` | `rgba(212,160,167,0.25)` |
| Translucent rose | `rgba(232,99,122,0.12)` | `rgba(232,99,122,0.14)` |

Add as needed during the sweep — but every new token must be defined in
`constants/colors.ts`, not inlined.

## Boundaries

In scope:
- `constants/colors.ts` — extend with `lightTheme` / `darkTheme` token sets,
  keep the existing flat `colors` export pointing at light for back-compat
  during the migration sweep
- `hooks/useTheme.ts` (new) — provider + hook + AsyncStorage persistence + OS
  preference detection via `useColorScheme`
- `app/_layout.tsx` — wrap root in `ThemeProvider`
- `app/(tabs)/profile.tsx` — add an Appearance section with Light / Dark /
  System segmented control
- `app/**/*.tsx`, `components/**/*.tsx` — convert hardcoded `colors.softBlush`
  / `colors.deepMauve` / etc. to theme-aware lookups
- `tailwind.config.js` + `global.css` — wire NativeWind's class-based dark mode
  so `bg-softBlush` / `text-deepMauve` automatically swap
- `constants/locales.ts` — new strings: Appearance, Light, Dark, System (EN +
  AR)
- `dark-palette-preview.html` — delete (temporary comparison file, not part of
  the app)

Out of scope:
- `supabase/**` (backend frozen)
- New screens, new top-level tabs
- Paywall (deferred — own Goal when store accounts are ready)
- Push notifications (own future Goal)
- Face-scan reliability (own future Goal)

## Iteration policy

1. **Foundation first** — extend `colors.ts` tokens, build `useTheme` provider
   + hook, wire AsyncStorage persistence + OS detection. Verify by changing one
   test surface (Home greeting) and confirming the toggle swaps it.
2. **NativeWind wiring** — add `darkMode: 'class'` to Tailwind config, switch
   brand colors to CSS variables that flip with a root `.dark` class. Verify
   the test surface still works AND classes like `bg-softBlush` swap
   automatically.
3. **Tab-by-tab sweep** in this order:
   - Home → Routine → Products → Profile → Scan
   - Then sub-routes: `scan-product`, `scan-history`
   - Then onboarding + auth screens (lower-traffic, but cover for completeness)
   - After each tab: snapshot both themes, fix contrast / readability before
     moving on
4. **Final pass** — side-by-side review of every screen, both themes, looking
   for "this is intentional in both" not "this got inverted." Then add the
   Appearance toggle to Profile (intentionally last so the user can't toggle
   mid-build into broken screens).

One tab at a time. Don't bundle.

## Blocked stop condition

- **Brand contrast failure** — if Brand Rose or gold accent contrast falls
  below WCAG AA on the dark surface, STOP and surface: "Adjust the brand color
  for dark mode, or adjust the dark surface? This is a brand call." Don't
  decide unilaterally.
- **Token system breakdown** — if three screens in a row need ad-hoc color
  overrides outside the theme token system, STOP — the tokens are wrong;
  redesign the token set before continuing the sweep.
- **Three failed migrations** — if a single screen takes three iterations
  without landing both themes correctly, stop and ask "What specifically isn't
  working? Walk me through what you saw."
