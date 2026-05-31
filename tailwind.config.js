/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        electric: {
          50: "#eefef4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#10b981", // Emerald Green
          600: "#059669",
          700: "#047857",
          850: "#064e3b",
          900: "#022c22",
        },
        coral: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#fa5252", // Coral Red
          600: "#e03131",
          700: "#c92a2a",
        },
        obsidian: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          800: "#212529",
          850: "#171B26", // Card bg in dark mode
          900: "#0B0F19", // Deep obsidian page bg
        }
      },
      animation: {
        'radar-pulse': 'radar-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'radar-pulse': {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '50%': { opacity: '0.4' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.4), 0 0 15px rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.4)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
