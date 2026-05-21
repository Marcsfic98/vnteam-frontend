// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "y-spin": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.85, transform: "scale(1.02)" },
        },
      },
      animation: {
        "y-spin-slow": "y-spin 3s linear infinite",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
      },
    },
  },
  // Plugin necessário para a rotação de moeda funcionar (backface-hidden)
  plugins: [require("tailwindcss-3d")],
};
