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
        // Ink — base unique #43261d pour tous les textes (opacités via /{opacité})
        ink: {
          DEFAULT: "#43261D",
        },
        // Accent Lifestyle — #F07020, #FFECD8, #B84000
        accent: {
          DEFAULT: "#F07020",
          dark: "#C05A18",
          text: "#B84000",
          bg: "#FFECD8",
        },
        // Espresso — textes basés sur l'opacité de #43261d (Warm Ink)
        espresso: {
          50: "#F2ECE4",
          100: "#E4D8C8",
          200: "#C7B296",
          300: "rgba(67,38,29,0.32)",
          400: "rgba(67,38,29,0.40)",
          500: "rgba(67,38,29,0.55)",
          600: "#362C21",
          700: "#291F19",
          800: "#1C1512",
          900: "#26221E",
        },
        // Cream — fonds de page et sections
        cream: {
          50: "#FBF4EB",
          100: "#FAF4E9",
          200: "#F3E8D2",
          300: "#EAD8B4",
          400: "#DEC28C",
        },
        gold: {
          400: "#D8B15B",
          500: "#C79A3D",
          600: "#A87D2C",
        },
      },
      fontFamily: {
        sans: ["var(--font-opening-hours)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
