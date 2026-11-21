import type { Config } from "tailwindcss";

// Design tokens — Nexovate brand
//   Background #F7F6FA · Text #17151F · Borders #E8E6ED
//   Violet #7545D9 (primary button, one accent word, small details)
//   Deep purple #4F2B9B (hover / pressed only)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7545D9", // Primary Violet
          deep: "#4F2B9B", // Deep Purple — hover / pressed only
          soft: "#EFE9FC",
        },
        ink: "#17151F", // Charcoal
        paper: "#F7F6FA", // Off-white background
        line: "#E8E6ED", // Borders
        muted: "#5E5A6B", // Secondary text (AA on #F7F6FA)
        bone: "#F2F0F5", // Off-white text on the dark section
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      // Type scale
      fontSize: {
        display: ["clamp(2.75rem, 7vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }], // 44 → 96px
        "section": ["clamp(2.25rem, 4.4vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }], // 36 → 56px
        "row": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }], // 28 → 40px
        "statement": ["clamp(2rem, 4.6vw, 4rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        body: ["1.0625rem", { lineHeight: "1.65" }], // 17px
        "body-lg": ["1.125rem", { lineHeight: "1.65" }], // 18px
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.12em" }], // 12px uppercase labels
      },
      // Spacing scale additions for editorial section rhythm
      spacing: { 18: "4.5rem", 35: "8.75rem", 45: "11.25rem" }, // 72 / 140 / 180px
      maxWidth: { measure: "62ch" },
      borderRadius: { xl: "14px", "2xl": "20px", btn: "6px", tile: "8px" },
      boxShadow: {
        card: "0 1px 2px rgba(23,21,31,0.04), 0 8px 24px -12px rgba(23,21,31,0.12)",
      },
      transitionTimingFunction: { "out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)" },
    },
  },
  plugins: [],
};

export default config;
