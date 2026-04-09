import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff1f5",
          100: "#ffe4ec",
          200: "#ffc9da",
          300: "#ff9fbe",
          400: "#ff6ea1",
          500: "#ff3b84",
          600: "#f11a6d"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(255, 59, 132, 0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;

