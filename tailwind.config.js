/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'goldman': ['Goldman', 'sans-serif'],
        'michroma': ['Michroma', 'sans-serif'],
        'viga': ['Viga', 'sans-serif'],
      },
    },
  },
  plugins: [],
}