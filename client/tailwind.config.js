/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0A1E38',
          900: '#0F2E52',
          800: '#154376',
        },
        paper: '#F5F8FC',
        accent: {
          500: '#3B9FE0',
          600: '#2C82BD',
        },
        ink: '#101826',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
