/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#008080', // Teal
        accent: '#00B7EB', // Cyan
        background: '#F3F4F6', // Light gray
        card: '#FFFFFF', // White
        text: '#374151', // Dark gray
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}