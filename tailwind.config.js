/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        liked: "green", // Use the liked color for text color
      },
    },
  },
  plugins: [],
};
