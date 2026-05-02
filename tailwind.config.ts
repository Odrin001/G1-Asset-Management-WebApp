import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#fa5252", // Main red
          600: "#e03131", // Strong red
          700: "#c92a2a", // Deep red
          800: "#b71c1c", // SDCA dark red
          900: "#a51111", // Even darker
        },
      },
    },
  },
  plugins: [],
};

export default config;
