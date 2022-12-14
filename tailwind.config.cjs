/* eslint @typescript-eslint/no-var-requires: "off" */
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "hsl(176, 100%, 83%)",
          100: "hsl(168, 100%, 83%)",
          200: "hsl(165, 100%, 83%)",
          300: "hsl(162, 100%, 83%)",
          400: "hsl(158, 76%, 79%)",
          500: "hsl(158, 41%, 66%)",
          600: "hsl(158, 24%, 54%)",
          700: "hsl(158, 21%, 42%)",
          800: "hsl(158, 21%, 25%)",
          900: "hsl(160, 21%, 16%)",
        },
        secondary: "hsla(220, 9%, 46%, 1)",
        success: "hsla(142, 71%, 45%,1)",
        danger: "hsla(0, 84%, 60%, 1)",
        layout: "hsla(220, 13%, 91%, 1)",
        description: "hsla(215, 28%, 17%, 1)",
        lowkey: "hsla(220, 9%, 46%, 1)",
      },
      boxShadow: {
        square:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities(customClasses);
    }),
    require("@tailwindcss/forms"),
  ],
};

const customClasses = [
  {
    ".container-res": {
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: "1280px",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
    "@media (min-width: 640px)": {
      ".container-res": {
        width: "89vw",
        paddingLeft: "0",
        paddingRight: "0",
      },
    },
  },
];
