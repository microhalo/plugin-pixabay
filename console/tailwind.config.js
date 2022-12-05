/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "pixabay-",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
