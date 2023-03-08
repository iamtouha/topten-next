/* eslint @typescript-eslint/no-var-requires: "off" */
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
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
        secondary: "hsl(220, 9%, 46%)",
        success: "hsl(142, 71%, 45%)",
        danger: "hsl(0, 84%, 60%)",
        layout: "hsl(0, 0%, 90%)",
        title: "hsl(0, 0%, 15%)",
        description: "hsl(0, 0%, 25%)",
        lowkey: "hsl(0, 0%, 45%)",
      },
      boxShadow: {
        square:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      },
      screens: {
        xxs: "320px",
        xs: "480px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@headlessui/tailwindcss"),
  ],
};
