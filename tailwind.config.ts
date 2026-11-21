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
      // Theme-aware colours read CSS variables (see globals.css):
      //   light theme → client dashboard & admin; dark theme (.theme-dark) → public website.
      colors: {
        brand: {
          DEFAULT: "rgb(var(--c-brand) / <alpha-value>)", // Nexovate violet
          deep: "rgb(var(--c-brand-deep) / <alpha-value>)", // hover / pressed
          soft: "rgb(var(--c-brand-soft) / <alpha-value>)", // quiet violet fill
          tint: "rgb(var(--c-brand-tint) / <alpha-value>)", // quiet fill — hover
        },
        ink: "rgb(var(--c-ink) / <alpha-value>)", // primary text
        paper: "rgb(var(--c-paper) / <alpha-value>)", // page background
        surface: "rgb(var(--c-surface) / <alpha-value>)", // cards, inputs
        line: "rgb(var(--c-line) / <alpha-value>)", // hairlines, borders
        muted: "rgb(var(--c-muted) / <alpha-value>)", // secondary text
        bone: "#F2F0F5", // off-white text on dark panels
        // fixed brand palette (never changes with the theme)
        obsidian: "#101014",
        charcoal: "#17171D",
        silver: "#A5A1AE",
        violet: "#7545D9",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // "serif" is the display face for headings (kept as a name so existing classes keep working)
        serif: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        // editorial accent — italic serif for one emphasised word
        accent: ["var(--font-serif)", "Georgia", "serif"],
      },
      // Type scale
      fontSize: {
        display: ["clamp(2.6rem, 6.4vw, 5.5rem)", { lineHeight: "1.0", letterSpacing: "-0.04em" }], // 42 → 88px
        "section": ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.06", letterSpacing: "-0.035em" }], // 32 → 52px
        "row": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }], // 28 → 40px
        "statement": ["clamp(2rem, 4.6vw, 4rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        body: ["1.0625rem", { lineHeight: "1.65" }], // 17px
        "body-lg": ["1.125rem", { lineHeight: "1.65" }], // 18px
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.12em" }], // 12px uppercase labels
      },
      // Spacing scale additions for editorial section rhythm
      spacing: { 18: "4.5rem", 35: "8.75rem", 45: "11.25rem" }, // 72 / 140 / 180px
      maxWidth: { measure: "62ch" },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px", btn: "999px", tile: "20px" },
      boxShadow: {
        card: "0 1px 2px rgba(23,21,31,0.04), 0 8px 24px -12px rgba(23,21,31,0.12)",
        lift: "0 1px 2px rgba(23,21,31,0.04), 0 24px 48px -20px rgba(79,43,155,0.28)",
        glow: "0 10px 30px -10px rgba(117,69,217,0.6)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-dot": { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
      transitionTimingFunction: { "out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)" },
    },
  },
  plugins: [],
};

export default config;
