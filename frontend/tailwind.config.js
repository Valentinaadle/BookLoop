/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'raptures-light': '#F6F3E7',
        'milk-tooth': '#FAEBD7',
        'caramel-essence': '#E3AF64',
        'sapphire-dust': '#516AC8',
        'blue-oblivion': '#26428B',
        'cosmic-odyssey': '#0F1939',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 