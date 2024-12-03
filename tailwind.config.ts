import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                "13": "repeat(13, minmax(0, 1fr))",
            },
            colors: {
                primary: {
                    400: "#e0e0ff",
                    500: "#d3d3ff",
                },
                secondary: {
                    500: "#fff9d3",
                },
            },
            fontFamily: {
                heading: ["Prociono", '"Times New Roman"', "serif"],
                body: ["Rubik", "Arial", "sans"],
            },
        },
        keyframes: {
            shimmer: {
                "100%": {
                    transform: "translateX(100%)",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
export default config;
