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
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'scale-up': 'scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
        },
        'fade-in': {
          'from': { opacity: 0 },
          'to': { opacity: 1 }
        },
        'fade-in-right': {
          'from': { opacity: 0, transform: 'translateX(20px) scale(0.95)' },
          'to': { opacity: 1, transform: 'translateX(0) scale(1)' }
        },
        'scale-up': {
          'from': { opacity: 0, transform: 'scale(0.95)' },
          'to': { opacity: 1, transform: 'scale(1)' }
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
