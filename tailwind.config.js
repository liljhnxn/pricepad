/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0d0e12",
          900: "#13141a",
          850: "#181921",
          800: "#1f202b",
          700: "#2d2f3d",
          600: "#444658",
        },
        accent: {
          purple: {
            DEFAULT: "#9d74f2",
            hover: "#b391f7",
            dim: "#7b54cc",
            bg: "rgba(157, 116, 242, 0.12)",
            border: "rgba(157, 116, 242, 0.3)",
          },
          green: {
            DEFAULT: "#38c186",
            hover: "#49d497",
            dim: "#279b69",
            bg: "rgba(56, 193, 134, 0.12)",
            border: "rgba(56, 193, 134, 0.3)",
          },
          rose: {
            DEFAULT: "#e05263",
            bg: "rgba(224, 82, 99, 0.12)",
            border: "rgba(224, 82, 99, 0.3)",
          },
        },
      },
    },
  },
  plugins: [],
};

