/* eslint @typescript-eslint/no-var-requires: "off" */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsla(217, 91%, 60%, 1)",
        secondary: "hsla(220, 9%, 46%, 1)",
        success: "hsla(142, 71%, 45%,1)",
        danger: "hsla(0, 84%, 60%, 1)",
        layout: "hsla(0, 0%, 90%, 1)",
        description: "hsla(0, 0%, 25%, 1)",
        lowkey: "hsla(0, 0%, 45%, 1)",
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
      "margin-left": "auto",
      "margin-right": "auto",
      "max-width": "1280px",
      "padding-left": "1rem",
      "padding-right": "1rem",
    },
    "@media (min-width: 640px)": {
      ".container-res": {
        width: "89vw",
        "padding-left": "0",
        "padding-right": "0",
      },
    },
  },
];
