import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050304",
        blood: "#d51f32",
        ember: "#ff3b4f",
        wine: "#421018",
        bone: "#f4eee2",
        ash: "#b8afa2",
        steel: "#58d7cf",
        gold: "#d9ae69",
      },
      boxShadow: {
        premium: "0 34px 110px rgba(0,0,0,0.58)",
        crimson: "0 22px 82px rgba(213,31,50,0.28)",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
