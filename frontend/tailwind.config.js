/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette
        'bl-brand':     '#2C5F8A',
        'bl-teal':      '#4A9B8E',
        'bl-amber':     '#E8A838',
        // Light mode surfaces
        'bl-cream':     '#F7F5F0',
        'bl-cream-dark':'#EDEAE3',
        // Dark mode surfaces
        'bl-night':     '#111827',
        'bl-night-card':'#1F2937',
        // Legacy (kept for backward compat)
        'raptures-light': '#F1EDE4',
        'milk-tooth':     '#FAEBD7',
        'caramel-essence':'#E8A838',
        'sapphire-dust':  '#2C5F8A',
        'blue-oblivion':  '#1A3A5C',
        'cosmic-odyssey': '#0D1421',
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'Georgia', 'serif'],
        'body':    ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        'playfair':['\"Playfair Display\"', 'serif'],
        'inter':   ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brand-sm':  '0 4px 14px rgba(44, 95, 138, 0.18)',
        'brand-md':  '0 8px 28px rgba(44, 95, 138, 0.28)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};