/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  //darkMode: "class", // used for custome class to enable the dark and light mode
  theme: {
    extend: {
      colors: {
        customBlue: "#FF9800",
        customLightGreen: "#D9EDBF",
        customeCardHeader: "#F1F5A8",
        customeBorderLine: "#8B93FF",
      },
    },
  },
  plugins: [],
};
