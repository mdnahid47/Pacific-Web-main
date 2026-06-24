import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "olympic": "#3c8ce7",
        "blue": "#2c67f2",
        "sky": "#00eaff",
        "golden": "#ecd115",
        "green": "#417505"
      },
      zIndex: {
        '100': '100',
        '110': '110',
        '9999': '9999',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
      },
      keyframes: {
        move: {
          "50%": { transform: 'translateY(-1rem)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      fontFamily: {
        "primary": ["Inter", "sans-serif"]
      },
      daisyui: {
        themes: [],
      },

    },
  },
  plugins: [daisyui],
}