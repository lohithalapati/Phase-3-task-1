/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neural-blue': '#3B82F6',
        'neural-cyan': '#06B6D4',
        'ai-purple': '#8B5CF6',
        'aurora-violet': '#A855F7',
      }
    },
  },
  plugins: [],
}
