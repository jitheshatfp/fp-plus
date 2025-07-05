/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#0a7ea4',
          dark: '#fff',
        },
        background: {
          light: '#fff',
          dark: '#151718',
        },
        text: {
          light: '#11181C',
          dark: '#ECEDEE',
        },
        icon: {
          light: '#687076',
          dark: '#9BA1A6',
        },
      },
    },
  },
  plugins: [],
}

