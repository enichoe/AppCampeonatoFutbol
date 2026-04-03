/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        unbounded: ['Unbounded', 'sans-serif'], // For high-impact titles if available, or just keep default
      },
      colors: {
        neon: '#00FF88',
        'slate-950': '#020617',
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        },
        violet: {
          500: '#A855F7',
        }
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 0.8, filter: 'brightness(1)' },
          '50%': { opacity: 1, filter: 'brightness(1.5) drop-shadow(0 0 15px #00FF88)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'subtle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.5)',
        'neon-glow': '0 0 30px rgba(0, 255, 136, 0.4)',
      }
    },
  },
  plugins: [],
}
