/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        md: "850px",
        xs: "400px",
      },
    },
  },
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
  "css.validate": false,
  "editor.quickSuggestions": {
    strings: true,
  },
  //important: true,
};
