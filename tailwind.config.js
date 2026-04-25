/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brandRose: '#E8637A',
        deepMauve: '#2D1B2E',
        softBlush: '#F9E8E8',
        dustyPink: '#D4A0A7',
        softLavender: '#F0E6F6',
        gold: '#C9A84C',
        success: '#7BA892',
        warning: '#D9A76A',
        error: '#C74A60',
        charcoal: '#2D2D2D',
        darkGray: '#5A5A5A',
        lightGray: '#E0E0E0',
        white: '#FFFFFF',
        scanBg: '#0D0D0D',
        scoreGreen: '#7DB87A',
        scoreAmber: '#E8A838',
        scoreRed: '#E07070',
      },
    },
  },
  plugins: [],
};
