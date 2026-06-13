/** @type {import('tailwindcss').Config} */
//
// Color strategy:
//   - Brand-invariant tokens (Brand Rose, gold, scoreGreen, etc.) stay as hardcoded
//     hex. They look the same on every surface so they don't need to flip with theme.
//   - Theme-dependent tokens (surface, ink, hairline) point at CSS variables defined
//     in global.css. The `:root { --color-X: ... }` block paints the light values; the
//     `.dark { --color-X: ... }` block overrides them in dark mode. Toggling the `dark`
//     class on documentElement is what swaps the theme.
//   - On native, NativeWind v4 reads these same CSS-variable declarations at build
//     time and switches based on its `colorScheme` setter, which our ThemeProvider
//     calls in sync with the web class toggle.
//
// Keep `scanBg` hardcoded — camera surfaces stay #0D0D0D regardless of theme.
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand-invariant.
        brandRose: '#E8637A',
        gold: '#C9A84C',
        success: '#7BA892',
        warning: '#D9A76A',
        error: '#C74A60',
        scoreGreen: '#7DB87A',
        scoreAmber: '#E8A838',
        scoreRed: '#E07070',
        scanBg: '#0D0D0D',

        // Theme-aware (CSS variables, swapped via .dark class in global.css).
        softBlush: 'var(--color-softBlush)',       // page surface
        deepMauve: 'var(--color-deepMauve)',       // ink primary
        darkGray: 'var(--color-darkGray)',         // ink secondary
        dustyPink: 'var(--color-dustyPink)',       // ink muted
        white: 'var(--color-white)',               // card / elevated surface
        softLavender: 'var(--color-softLavender)', // tiny tint variant
        lightGray: 'var(--color-lightGray)',       // hairline ish
        charcoal: 'var(--color-charcoal)',         // dense ink (rarely used)
      },
    },
  },
  plugins: [],
};
