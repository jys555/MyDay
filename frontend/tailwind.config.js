/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050816",
          soft: "#0b1120",
          softer: "#020617"
        },
        primary: {
          DEFAULT: "#38bdf8"
        },
        accent: {
          pink: "#ec4899",
          purple: "#a855f7"
        }
      }
    }
  },
  plugins: []
};

