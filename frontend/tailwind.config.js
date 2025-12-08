/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10a37f', // ChatGPT 绿
        accent: '#22d3a5',
        ink: '#e5e7eb'
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'system-ui']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
