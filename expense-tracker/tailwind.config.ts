import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'tw-bg-green-100',
    'tw-bg-red-100',
  ],
  plugins: [],
} satisfies Config;

export default config;
