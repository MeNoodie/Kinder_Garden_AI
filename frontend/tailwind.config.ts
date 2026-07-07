import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        sidebar: "#111827",
        surface: "#161B26",
        border: "#262D3D",
        accent: "#4F8CFF",
        accentSecondary: "#14D99B",
        foreground: "#F3F4F6",
        muted: "#9CA3AF",
      },
      boxShadow: {
        glass: "0 18px 60px rgba(0, 0, 0, 0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
