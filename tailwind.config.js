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
        // Light mode colors - Modern gradient blues with pops of color
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',    // Main primary
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',    // Main secondary
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        accent: '#8B5CF6',    // Vibrant purple for contrast
        success: '#10B981',   // Emerald green
        warning: '#F59E0B',   // Amber
        error: '#EF4444',     // Red for errors
        info: '#3B82F6',      // Keeping your original info
        
        light: '#F8FAFC',     // Lighter background
        dark: '#0F172A',      // Dark mode text color

        // Dark mode colors - Deep, rich colors with good contrast
        'dark-primary': {
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',     // Main dark primary
          800: '#0F172A',
          900: '#020617',
        },
        'dark-secondary': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        'dark-accent': '#A78BFA',       // Lighter purple for dark mode
        'dark-success': '#34D399',
        'dark-warning': '#FBBF24',
        'dark-error': '#F87171',
        'dark-info': '#60A5FA',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'], // Inter is more modern
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      },
      keyframes: {
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        slideDown: "slideDown 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
      },
    },
  },
  plugins: [],
}