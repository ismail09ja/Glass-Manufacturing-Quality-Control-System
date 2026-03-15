/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef7ff',
                    100: '#d9edff',
                    200: '#bce0ff',
                    300: '#8eccff',
                    400: '#59afff',
                    500: '#338bff',
                    600: '#1b6af5',
                    700: '#1454e1',
                    800: '#1744b6',
                    900: '#193c8f',
                    950: '#142757',
                },
                glass: {
                    50: '#f0fdf9',
                    100: '#ccfbeb',
                    200: '#9af5d8',
                    300: '#5fe9c2',
                    400: '#2dd4a8',
                    500: '#14b890',
                    600: '#0b9575',
                    700: '#0d7760',
                    800: '#105e4e',
                    900: '#124d41',
                    950: '#042f28',
                },
                surface: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.2)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
