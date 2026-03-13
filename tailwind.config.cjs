/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'clinical-bg': '#f5f7fb',
        'clinical-card': '#ffffff',
        'clinical-accent': '#2563eb',
        'clinical-accent-soft': '#dbeafe'
      },
      boxShadow: {
        'soft-card': '0 18px 40px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

