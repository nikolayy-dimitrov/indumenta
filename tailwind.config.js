/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/swiper/swiper.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#F8E9D5",
        "secondary": "#181819",
        "content": "#B5FED9",
      },
    },
    fontFamily: {
      Josefin: ["Josefin Sans", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
}

