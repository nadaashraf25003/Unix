
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: '#FF7802',       // bright orange
        secondary: '#DD8327',     // orange/brown
        info: '#407593',          // blue/teal
        success: '#A0F78F',       // green
        warning: '#FAF494',       // light yellow
        light: '#f8f9fa',
        dark: '#212121',

        // Dark mode colors
        'dark-primary': '#8E6330',   // brown/dark accent
        'dark-secondary': '#8E6330', // can reuse brown
        'dark-info': '#FAF494',      // light yellow for contrast
        'dark-success': '#A0F78F',
        'dark-warning': '#DD8327',   // dark orange
        'dark-bg': '#121212',
        'dark-card': '#1e1e1e',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 6px 30px rgba(0, 0, 0, 0.15)',
        'card-dark': '0 4px 20px rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
