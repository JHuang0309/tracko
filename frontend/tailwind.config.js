/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        'primary1': '#560bad',
        'primary2': '#7209b7',
        'secondary1': '#b5179e',
        'secondary2': '#f72585',
        'background': '#11023c',
      }, 
      fontFamily: {
        default: ['Poppins', 'sans-serif'],
      },
      screens: {
        sm: '640px',   // default is 640px
        md: '768px',   // default is 768px
        lg: '1024px',  // default is 1024px
    },
    },
  },
  plugins: [],
}
