/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // animate growth of division
      animation: {
        grow: "grow 0.2s ease-in-out",
        comeIn: "comeIn 0.2s ease-in-out",
        goOut: "goOut 0.2s ease-in-out",
      },
      comeIn: {
        "0%": {
          opacity: 0,
          transform: "translateY(10%)",
        },
        "100%": {
          opacity: 1,
          transform: "translateY(0)",
        },
      },
      goOut: {
        "0%": {
          opacity: 0,
        },
        "100%": {
          opacity: 1,
        },
      },
      // keyframes for growth animation
      keyframes: {
        grow: {
          "0%": {
            opacity: 0,
            transform: "translateY(10%)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
