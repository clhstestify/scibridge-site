/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#E0F2FE",
          DEFAULT: "#38BDF8",
          dark: "#0EA5E9"
        },
        accent: {
          light: "#FCE7F3",
          DEFAULT: "#EC4899"
        }
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      }
    }
  },
  plugins: []
};
