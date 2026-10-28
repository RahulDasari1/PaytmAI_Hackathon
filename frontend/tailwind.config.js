/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paytm: {
          navy: '#0F2D6B',
          darkNavy: '#0A1E42',
          blue: '#002970',
          cyan: '#00BAF2',
          lightBlue: '#EBF7FF',
          accent: '#00B894'
        }
      }
    },
  },
  plugins: [],
}
