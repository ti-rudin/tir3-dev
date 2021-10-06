module.exports = {
  purge: ["./src/**/*.svelte", "./src/**/*.html"],
  theme: {
    extend: {
      screens: {
        'dark': {'raw': '(prefers-color-scheme: dark)'},
        // => @media (prefers-color-scheme: dark) { ... }
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem"
        }
    },
  },
  variants: {

  },
  plugins: [],
};
