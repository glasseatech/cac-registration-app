/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                deepGreen: "#0B5E2E",
                accentGreen: "#1E8449",
                navy: "#0F1C2E",
                gold: "#F4B400",
                bg: "#F8F9FA",
                text: "#0B1220",
                muted: "#5B6473",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
