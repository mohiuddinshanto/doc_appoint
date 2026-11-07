import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./store/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/*/node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        ink: "#0b1020",
        brand: {
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c7cbfe",
          300: "#a5aafd",
          400: "#8184fa",
          500: "#5b5bf0",
          600: "#4747d6",
          700: "#3636b0",
          800: "#2b2b9e",
          900: "#1e1e6f",
        },
      },
    },
  },
  darkMode: "class",
  // HeroUI currently bundles Tailwind 4 types while this project uses Tailwind 3.
  // The plugin is runtime-compatible; this cast resolves the cross-version type mismatch.
  plugins: [heroui() as unknown as NonNullable<Config["plugins"]>[number]],
};

export default config;
