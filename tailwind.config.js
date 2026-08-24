/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff0f7',
          100: '#ffe0ee',
          200: '#ffc2de',
          300: '#ff94c4',
          400: '#ff5ea0',
          500: '#ff2983',
          600: '#f0055f',
          700: '#d0004a',
          800: '#a8003d',
          900: '#8c0637',
          950: '#57001e',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
