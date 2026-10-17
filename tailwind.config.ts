import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#eef7ff",
          100: "#d9ecff",
          200: "#bce0ff",
          300: "#8eccff",
          400: "#58adff",
          500: "#3088ff",
          600: "#1867f5",
          700: "#1251e1",
          800: "#1442b6",
          900: "#163a8f",
          950: "#112457",
        },
        accent: {
          50: "#fff7ed",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        emerald: {
          500: "#10b981",
          600: "#059669",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px 0 rgba(0,0,0,0.05)',
        'elevated': '0 20px 30px -10px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
