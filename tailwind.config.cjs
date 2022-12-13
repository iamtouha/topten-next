/* eslint @typescript-eslint/no-var-requires: "off" */

/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsla(217, 91%, 60%, 1)",
        secondary: "hsla(220, 9%, 46%, 1)",
        success: "hsla(142, 71%, 45%,1)",
        danger: "hsla(0, 84%, 60%, 1)",
        background: "hsla(0, 0%, 100%, 1)",
        title: "hsla(0,0%,12%, 1)",
        content: "hsla(0, 0%, 20%, 0.7)",
        offwhite: "hsla(0, 0%, 100%, 0.7)",
      },
      boxShadow: {
        square:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      },
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
