/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0F766E",
          dark: "#0B544E",
          light: "#E4F3F1",
        },
        ink: "#1B2A2F",
        sage: "#F4F7F5",
        coral: "#E8604C",
        lavender: "#8B7FD1",
        amber: "#F4A835",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(15, 118, 110, 0.25)",
      },
    },
  },
  plugins: [],
};
