import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      colors: {
        primary: '#C026D3', // Fuchsia 600
        secondary: '#4F46E5', // Indigo 600
        accent: '#F59E0B', // Amber 500
      }
    },
  },
  plugins: [],
};
export default config;