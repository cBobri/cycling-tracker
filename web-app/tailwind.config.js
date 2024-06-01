/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                darkLight: {
                    100: "#f5f7f7",
                    200: "#e4eef2",
                    300: "#ccdde3",
                    400: "#9fb5bf",
                    500: "#78919c",
                    600: "#587580",
                    700: "#29434d",
                    800: "#0c2c38",
                    900: "#01161e",
                },
                primary: {
                    100: "#2390ba",
                    200: "#196380",
                    300: "#124559",
                },
                secondary: "#598392",
                tertiary: "#aec3b0",
            },
            fontFamily: {
                roboto: ['"Roboto"', '"sans-serif"'],
                robotoCondensed: ['"Roboto Condensed"', '"sans-serif"'],
            },
        },
    },
    plugins: [],
};
