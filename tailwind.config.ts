import type { Config } from "tailwindcss";

// Design tokens — Nexovate brand
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7545D9", // Primary Violet
          deep: "#4F2B9B", // Deep Purple
          soft: "#EFE9FC",
        },
        ink: "#17151F", // Charcoal
        paper: "#F7F6FA", // Off-white
        line: "#E8E6ED", // Subtle grey
        muted: "#5E5A6B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "14px", "2xl": "20px" },
      boxShadow: {
        card: "0 1px 2px rgba(23,21,31,0.04), 0 8px 24px -12px rgba(23,21,31,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
