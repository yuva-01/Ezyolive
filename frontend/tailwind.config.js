/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eaf5ff',
          100: '#d6ebff',
          200: '#addcff',
          300: '#84c4ff',
          400: '#5ba4ff',
          500: '#4285f4', // Primary brand color
          600: '#3367d6', // Darker shade for hover
          700: '#2554c7',
          800: '#1a3c94',
          900: '#0f2a6b',
        },
        secondary: {
          50: '#edfcf5',
          100: '#d6f9e5',
          200: '#b0f0ce',
          300: '#7adda9',
          400: '#48c282',
          500: '#34a853', // Secondary brand color (Green)
          600: '#2b8944',
          700: '#256b38',
          800: '#205030',
          900: '#1c432b',
        },
        accent: {
          50: '#fff8e6',
          100: '#ffeecc',
          200: '#ffdd99',
          300: '#ffcc66',
          400: '#fbbc05', // Accent color (Yellow)
          500: '#f9a825',
          600: '#e69b00',
          700: '#cc7a00',
          800: '#a65c00',
          900: '#804600',
        },
        danger: {
          50: '#fdeded',
          100: '#fad7d7',
          200: '#f5b0b0',
          300: '#ea8888',
          400: '#e25d5d',
          500: '#ea4335', // Danger color (Red)
          600: '#d92f21',
          700: '#b4271c',
          800: '#8e1e17',
          900: '#751c14',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#5f6368',
          700: '#3c4043',
          800: '#202124',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        display: ['Google Sans', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
        dropdown: '0 2px 10px 0 rgba(60, 64, 67, 0.2)',
        elevated: '0 8px 16px 0 rgba(60, 64, 67, 0.2)',
      },
    },
  },
  plugins: [],
}
