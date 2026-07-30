/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', '"Arial Rounded MT Bold"', "system-ui", "sans-serif"],
        rounded: ['"Nunito"', "system-ui", "sans-serif"]
      },
      colors: {
        bingo: {
          blue: "rgb(var(--color-bingo-blue) / <alpha-value>)",
          mint: "rgb(var(--color-bingo-mint) / <alpha-value>)",
          yellow: "rgb(var(--color-bingo-yellow) / <alpha-value>)",
          lavender: "rgb(var(--color-bingo-lavender) / <alpha-value>)",
          indigo: "rgb(var(--color-bingo-indigo) / <alpha-value>)",
          coral: "rgb(var(--color-bingo-coral) / <alpha-value>)",
          navy: "rgb(var(--color-bingo-navy) / <alpha-value>)"
        }
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        pop: "var(--shadow-pop)",
        "pop-sm": "var(--shadow-pop-sm)"
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.5rem"
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "float-soft": "floatSoft 5s ease-in-out infinite",
        "sparkle": "sparkle 2.4s ease-in-out infinite"
      },
      keyframes: {
        floatSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        sparkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(.8) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.15) rotate(12deg)" }
        }
      }
    }
  },
  plugins: []
};

