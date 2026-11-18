import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#231f20",
        primary: "#D04741",
        gray: {
          DEFAULT: "#474747",
          sub: "#CECECE"
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'var(--font-inter)',
          'Montserrat',
          'var(--font-montserrat)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        heading: ['var(--font-outfit)', 'Outfit', 'var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        bebas: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'Orbitron', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        mechanical: ['var(--font-mechanical)', 'sans-serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        // clamp(min, preferred, max) — scales smoothly with viewport
        'h1': ['clamp(2rem, 7vw, 83px)', { lineHeight: '1.05' }],
        'h2': ['clamp(1.75rem, 5.5vw, 64px)', { lineHeight: '1.05' }],
        'h3': ['clamp(1.5rem, 4vw, 48px)', { lineHeight: '1.1' }],
        'h4': ['clamp(1.2rem, 3vw, 36px)', { lineHeight: '1.2' }],
        'h5': ['14px', { lineHeight: 'normal' }],
      }
    },
  },
  plugins: [],
};
export default config;
