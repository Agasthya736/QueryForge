/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#0d0d10",   // page background
          1: "#16161b",   // card background
          2: "#1c1c22",   // hover / elevated card
        },
        borderc: "#26262d",
        accent: {
          blue: "#7aa2f7",
          purple: "#bb9af7",
        },
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}