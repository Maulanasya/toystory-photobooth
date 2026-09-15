/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: "#00f0ff",
          dark: "#0a0e17",
          panel: "#111827",
          accent: "#3b82f6"
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace', 'JetBrains Mono'], // Font bergaya terminal/tech
      }
    },
  },
  plugins: [],
}