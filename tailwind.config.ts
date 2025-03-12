import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)", // Gunakan warna dari CSS Variables
      },
    },
  },
  plugins: [],
};

export default config;
