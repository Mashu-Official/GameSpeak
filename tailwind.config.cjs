/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // './src/components/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};