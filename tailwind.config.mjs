/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#F5B800",
          50: "#FFF6D9",
          100: "#FFEDB2",
          200: "#FFDF7A",
          300: "#FFD043",
          400: "#F5B800",
          500: "#D6A000",
          600: "#A37C00",
          700: "#6E5300",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Oswald", "Impact", "sans-serif"],
      },
    },
  },
  plugins: [],
};
