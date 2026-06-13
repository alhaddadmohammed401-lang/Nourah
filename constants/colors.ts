// Color tokens — the single source of truth for surface and ink colors across the app.
//
// Two parallel theme objects live below: `lightTheme` and `darkTheme`. Components read
// the active one via `useTheme()` (hooks/useTheme.tsx). Brand colors (Brand Rose, gold,
// score traffic-light) are theme-invariant — they look the same on every surface.
//
// The legacy flat `colors` export is preserved and points at the LIGHT theme so the
// existing codebase (which imports `colors.softBlush` etc. directly) keeps working
// during the dark-mode migration sweep. New code should prefer `useTheme().colors`.

export type ThemeName = 'light' | 'dark';

// Brand-invariant tokens: same hex in both themes. Live outside the theme objects so
// they can be referenced without going through `useTheme()` when the surface doesn't
// matter (e.g. a Brand-Rose CTA looks the same in both modes).
export const brand = {
  brandRose: '#E8637A',
  brandRosePressed: '#D4547A',
  gold: '#C9A84C',
  scoreGreen: '#7DB87A',
  scoreAmber: '#E8A838',
  scoreRed: '#E07070',
  success: '#7BA892',
  warning: '#D9A76A',
  error: '#C74A60',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LIGHT — today's surface, unchanged.
// ─────────────────────────────────────────────────────────────────────────────
export const lightTheme = {
  // Surfaces — bottom up.
  surface: '#F9E8E8',            // page background (Soft Blush)
  surfaceElevated: '#FFFFFF',    // card / sheet
  surfaceMuted: '#F0E6F6',       // tiny tint variants (Soft Lavender)
  scanBg: '#0D0D0D',             // camera surfaces stay dark on both themes

  // Ink — primary → muted, top down.
  ink: '#2D1B2E',                // Deep Mauve — primary body + headlines
  inkSecondary: '#5A5A5A',       // body secondary / eyebrows
  inkMuted: '#D4A0A7',           // Dusty Pink — disabled / placeholder
  inkOnAccent: '#FFFFFF',        // text on Brand Rose / gold buttons

  // Hairlines + translucent fills (always rgba so they composite cleanly).
  hairline: 'rgba(212, 160, 167, 0.45)',  // dusty-pink 45% — card borders, dividers
  hairlineSoft: 'rgba(212, 160, 167, 0.25)',
  accent: 'rgba(232, 99, 122, 0.12)',     // Brand-Rose chip background
  accentStrong: 'rgba(232, 99, 122, 0.20)',

  // Lifted brand for back-compat with `colors.X` imports — same hex as `brand.X`.
  brandRose: brand.brandRose,
  gold: brand.gold,
  success: brand.success,
  warning: brand.warning,
  error: brand.error,
  scoreGreen: brand.scoreGreen,
  scoreAmber: brand.scoreAmber,
  scoreRed: brand.scoreRed,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// WARM DARK — brand-tinted near-black. Locked palette per Stage 3 Goal.
// ─────────────────────────────────────────────────────────────────────────────
export const darkTheme = {
  // Surfaces — Deep-Mauve-tinted darks, never pure #000.
  surface: '#1A0F1B',
  surfaceElevated: '#261A28',
  surfaceMuted: '#1F1320',
  scanBg: '#0D0D0D',             // camera surface unchanged

  // Ink — softened off-white so it doesn't burn against the warm surface.
  ink: '#F2E2E5',
  inkSecondary: '#D4A0A7',       // Dusty Pink — same hex but reads as "muted ink" here
  inkMuted: '#B89AA1',
  inkOnAccent: '#FFFFFF',

  // Hairlines + translucent fills tuned for the dark surface.
  hairline: 'rgba(212, 160, 167, 0.25)',
  hairlineSoft: 'rgba(212, 160, 167, 0.14)',
  accent: 'rgba(232, 99, 122, 0.14)',
  accentStrong: 'rgba(232, 99, 122, 0.22)',

  // Brand stays the same — these tokens exist on both themes so a typed `colors.X`
  // lookup works identically regardless of which theme is active.
  brandRose: brand.brandRose,
  gold: brand.gold,
  success: brand.success,
  warning: brand.warning,
  error: brand.error,
  scoreGreen: brand.scoreGreen,
  scoreAmber: brand.scoreAmber,
  scoreRed: brand.scoreRed,
} as const;

// Structural type — both themes have the same keys but different hex values, so we
// can't use `typeof lightTheme` (its literal types would lock to the light hex
// strings and fail to accept the dark equivalents).
export type ThemeColors = {
  readonly [K in keyof typeof lightTheme]: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Legacy flat export. Resolves to LIGHT theme.
//
// Reason: every screen and component currently does `import { colors } from
// '../../constants/colors'` and reads e.g. `colors.softBlush`. During the dark-mode
// migration sweep, we keep this shape working so the codebase compiles and renders
// correctly at every commit. After the sweep, components are migrated tab-by-tab to
// `useTheme()` and the legacy keys here become dead code we can remove.
//
// New imports SHOULD use `useTheme()`. Don't add new keys to this object.
// ─────────────────────────────────────────────────────────────────────────────
export const colors = {
  brandRose: brand.brandRose,
  deepMauve: lightTheme.ink,
  softBlush: lightTheme.surface,
  dustyPink: lightTheme.inkMuted,
  softLavender: lightTheme.surfaceMuted,
  gold: brand.gold,
  success: brand.success,
  warning: brand.warning,
  error: brand.error,
  charcoal: '#2D2D2D',
  darkGray: lightTheme.inkSecondary,
  lightGray: '#E0E0E0',
  white: lightTheme.surfaceElevated,
  scanBg: lightTheme.scanBg,
  scoreGreen: brand.scoreGreen,
  scoreAmber: brand.scoreAmber,
  scoreRed: brand.scoreRed,
} as const;
