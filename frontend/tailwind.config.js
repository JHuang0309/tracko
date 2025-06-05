/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        'green-theme': 'rgb(16, 185, 129)',
        'blue-theme': 'rgb(59, 130, 246)',
        'purple-theme': 'rgb(147, 51, 234)',
        'indigo-theme': 'rgb(139, 92, 247)',
        'red-theme': 'rgb(239, 68, 68)',
        'amber-theme': 'rgb(245, 158, 11)',
        'orange-theme': 'rgb(249, 115, 21)',
        'pink-theme': 'rgb(236, 71, 153)',
        'green-theme-highlight': 'rgb(209, 250, 229)',
        'blue-theme-highlight': 'rgb(219, 234, 254)',
        'purple-theme-highlight': 'rgb(237, 233, 254)',
        'red-theme-highlight': 'rgb(254, 226, 226)',
        'amber-theme-highlight': 'rgb(255, 243, 192)',
        'pink-theme-highlight': 'rgb(252, 231, 244)',
        'green-theme-dark': 'rgb(52, 211, 153)',
        'blue-theme-dark': 'rgb(96, 165, 250)',
        'purple-theme-dark': 'rgb(168, 85, 247)',
        'red-theme-dark': 'rgb(248, 113, 113)',
        'amber-theme-dark': 'rgb(251, 191, 36)',
        'green-theme-highlight-dark': 'rgb(6, 78, 59)',
        'blue-theme-highlight-dark': 'rgb(30, 58, 138)',
        'purple-theme-highlight-dark': 'rgb(88, 28, 135)',
        'red-theme-highlight-dark': 'rgb(153, 27, 27)',
        'amber-theme-highlight-dark': 'rgb(146, 64, 14)',
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
