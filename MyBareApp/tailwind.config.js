module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
       colors:{
        "olympic":"#3c8ce7",
        "blue":"#2c67f2",
        "sky":"#00eaff",
        "golden":"#ecd115",
        "green":"#417505"
      },
    },
  },
  plugins: [],
};