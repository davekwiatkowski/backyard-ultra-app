import type { Config } from "tailwindcss";
import { Theme } from "./src/constants/ThemeConstants";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [Theme.DARK, Theme.LIGHT],
  },
};

export default config;
