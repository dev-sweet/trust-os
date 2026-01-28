/** @type {import('tailwindcss').Config} */

module.exports = {
  important: "#root",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // <— pages and layouts
    "./components/**/*.{js,ts,jsx,tsx}", // <— your components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#F59E0B",
        success: "#10B981",
        danger: "#EF4444",
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        "bg-primary": "#FFFFFF",
        "bg-secondary": "#F3F4F6",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h2: ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        p: ["1rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        span: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
      },
    },
  },
  plugins: [],
};

// tailwind.config.js
