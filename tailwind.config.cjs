/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rounded: ['"Baloo 2"', "system-ui", "sans-serif"]
      },
      colors: {
        bingo: {
          blue: "#BFE5FF",
          mint: "#C8F2E2",
          yellow: "#FFF4BF",
          lavender: "#E5D9FF",
          coral: "#FFB5A7",
          navy: "#1E2A3B"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.5rem"
      }
    }
  },
  plugins: []
};

