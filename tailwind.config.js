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
          50: '#fef2f8',
          100: '#fde6f2',
          200: '#fcc5e1',
          300: '#fba0ca',
          400: '#f66daa',
          500: '#ed4291',
          600: '#db2270',
          700: '#be1559',
          800: '#9c144a',
          900: '#821540',
          950: '#500423',
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
