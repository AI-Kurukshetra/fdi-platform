import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0f172a",
        surface: "#111827",
        line: "#1e293b",
        ink: "#f8fafc",
        muted: "#94a3b8",
        accent: {
          DEFAULT: "#6366f1",
          soft: "#312e81",
          deep: "#818cf8"
        },
        success: "#14b8a6",
        warning: "#f59e0b"
      },
      boxShadow: {
        panel: "0 24px 60px -36px rgba(15, 23, 42, 0.75)",
        glow: "0 12px 32px -18px rgba(99, 102, 241, 0.58)"
      },
      borderRadius: {
        panel: "0.75rem"
      },
      backgroundImage: {
        "dashboard-glow":
          "radial-gradient(circle at top left, rgba(99, 102, 241, 0.24), transparent 30%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 28%), linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,1))",
        "panel-gradient":
          "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.08) 42%, rgba(17,24,39,0) 72%)",
        "indigo-mesh":
          "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.18), rgba(59,130,246,0.18))"
      },
      fontFamily: {
        display: ["Space Grotesk", "Manrope", "Inter", "system-ui", "sans-serif"],
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"]
      },
      keyframes: {
        "soft-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "soft-float": "soft-float 7s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
