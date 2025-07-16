import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "olympic":"#3c8ce7",
        "blue":"#2c67f2",
        "sky":"#00eaff",
        "golden":"#ecd115",
        "green":"#417505"
      },
      zIndex: {
        '100': '100',
        '110': '110',
        '9999': '9999',
      },
      keyframes:{
        move:{
          "50%":{transform: 'translateY(-1rem)'}
        }
      },
      fontFamily:{
        "primary":["Inter", "sans-serif"]
      },
      daisyui: {
        themes: [],
      },
      
    },
  },
  plugins: [daisyui],
}