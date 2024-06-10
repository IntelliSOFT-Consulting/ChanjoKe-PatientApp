/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#163C94',
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
}

