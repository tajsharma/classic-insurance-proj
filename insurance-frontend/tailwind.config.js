/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage:{
        'family-picture': "url('/src/Assets/family-matters.jpg')",
      }
    },
  },
  plugins: [],
}

