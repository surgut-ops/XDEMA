/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: { DEFAULT: '#09090f', 2: '#111118', 3: '#16161f' },
        c1: 'var(--c1)',
        c2: 'var(--c2)',
        c3: '#ffd600',
        c4: '#7b61ff',
        c5: '#00e87a',
      },
      animation: {
        float: 'float 4.5s ease-in-out infinite',
        swave: 'swave 1.3s ease-in-out infinite',
        vspin: 'vspin 4s linear infinite',
        glitch: 'glitch 9s infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        swave: { '0%,100%': { transform: 'scaleY(.25)' }, '50%': { transform: 'scaleY(1)' } },
        vspin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        glitch: {
          '0%,92%,100%': { filter: 'none' },
          '93%': { filter: 'blur(.4px)' },
          '97%': { filter: 'none' },
        },
      },
    },
  },
  plugins: [],
};
