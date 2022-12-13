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
  plugins: [require("@tailwindcss/forms")],
};
