/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'ui-serif', 'Georgia', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0,0,0,0.18)'
      }
    }
  },
  plugins: []
};
