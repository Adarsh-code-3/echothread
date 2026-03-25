/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FFFBF5",
        "cream-dark": "#FFF5E9",
        coral: {
          400: "#FF9A56",
          500: "#FF6B6B",
          600: "#E85D5D",
        },
        ink: "#1A1A2E",
        muted: "#6B7280",
        surface: "#FFFFFF",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
        "morph": "morph 8s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,107,107,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,107,107,0.6)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "40% 60% 50% 50% / 30% 50% 60% 40%" },
          "75%": { borderRadius: "50% 30% 60% 40% / 60% 40% 50% 60%" },
        },
      },
    },
  },
  plugins: [],
}
