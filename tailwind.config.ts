import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        bonewhite: "var(--bonewhite)",
        dbrown: "var(--d-brown)",
        lbrown: "var(--l-brown)",
        l2brown: "var(--l2-brown)",
      },
    },
  },
  plugins: [],
};

export default config;
