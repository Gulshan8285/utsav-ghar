import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: {
            DEFAULT: '#641C24',
            dark: '#451218',
            light: '#832833',
            50: '#FBF5F5',
            100: '#F5E7E8',
            200: '#E7C7CA',
          },
          vermilion: {
            DEFAULT: '#C64B32',
            dark: '#A33720',
            light: '#DD6248',
            50: '#FDF6F4',
            100: '#FAE8E4',
          },
          gold: {
            DEFAULT: '#C6A15B',
            dark: '#A6833D',
            light: '#D8B878',
            muted: '#E5D4B1',
            50: '#FDFBF7',
            100: '#FAF3E7',
          },
          ivory: {
            DEFAULT: '#FFF9F0',
            dark: '#F5ECE0',
            light: '#FFFDFA',
          },
          charcoal: {
            DEFAULT: '#292521',
            light: '#443E38',
            muted: '#686058',
          },
          sand: {
            DEFAULT: '#EDE3D5',
            dark: '#D9CBBB',
            light: '#F7F2EB',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'festive-sm': '0 2px 8px -2px rgba(100, 28, 36, 0.08), 0 1px 4px -1px rgba(198, 161, 91, 0.06)',
        'festive-md': '0 8px 20px -4px rgba(100, 28, 36, 0.12), 0 4px 12px -2px rgba(198, 161, 91, 0.10)',
        'festive-lg': '0 16px 32px -6px rgba(100, 28, 36, 0.16), 0 8px 20px -4px rgba(198, 161, 91, 0.14)',
        'gold-glow': '0 0 20px rgba(198, 161, 91, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
