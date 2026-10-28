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
          blue: '#002970',       // Paytm Deep Trust Blue
          cyan: '#00BAF2',       // Paytm Iconic Cyan
          navy: '#10243A',       // High-contrast Fintech Navy
          darkNavy: '#081728',   // Deepest header navy
          lightBlue: '#F0F9FF',  // Very soft sky tint
          accent: '#00B894',     // Emerald accent
          bg: '#F5F8FC',         // Clean neutral fintech app background
          border: '#E4EAF1',     // Standard subtle 1px border
          textMain: '#1D2939',   // Crisp primary text
          textMuted: '#667085',  // Secondary helper text
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'fintech-xs': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'fintech-sm': '0 1px 3px 0 rgba(16, 24, 40, 0.08), 0 1px 2px -1px rgba(16, 24, 40, 0.04)',
        'fintech-md': '0 4px 12px -2px rgba(16, 24, 40, 0.06), 0 2px 6px -2px rgba(16, 24, 40, 0.04)',
        'fintech-lg': '0 12px 24px -4px rgba(16, 24, 40, 0.08), 0 4px 8px -2px rgba(16, 24, 40, 0.03)',
      }
    },
  },
  plugins: [],
}
