const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0070f3", // Main brand color
        secondary: "#7928CA", // Secondary color for accents
        accent: "#FF4081", // Accent color for buttons and highlights
        white: "#ffffff", // White color
        black: "#000000", // Black color
        gray: {
          100: "#F7FAFC", // Light gray
          200: "#EDF2F7", // Gray for backgrounds
          300: "#E2E8F0", // Medium gray
          400: "#A0AEC0", // Darker gray for borders
          500: "#4A5568", // Charcoal gray
        },
      },
      screens: {
        xs: "457px", // Extra small screens
        sm: "640px", // Small screens
        ssm: "700px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra large screens
        "2xl": "1536px", // 2x extra large screens
        "3xl": "1920px", // 3x extra large screens
        "4xl": "2560px", // 4x extra large screens
        "5xl": "3200px", // 5x extra large screens
      },
      spacing: {
        '0': '0px', // Add zero spacing
        '1': '0.25rem', // Small spacing
        '2': '0.5rem', // Smaller spacing
        '3': '0.75rem', // Medium-small spacing
        '4': '1rem', // Medium spacing
        '5': '1.25rem', // Medium-large spacing
        '6': '1.5rem', // Large spacing
        '8': '2rem', // Extra large size
        '10': '2.5rem', // 2.5x extra large size
        '12': '3rem', // 3x extra large size
        '14': '3.5rem', // 3.5x extra large size
        '16': '4rem', // 4x extra large size
        '20': '5rem', // 5x extra large size
      },
      animation: {
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        'spin-reverse': {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [nextui()],
};
