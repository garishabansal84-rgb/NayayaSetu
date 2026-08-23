/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nyaya: {
          navy: '#0A192F',
          dark: '#0F172A',
          card: '#1E293B',
          cardBorder: '#334155',
          saffron: '#F97316',
          saffronHover: '#EA580C',
          green: '#10B981',
          gold: '#EAB308',
          blue: '#38BDF8',
          royal: '#2563EB',
          textMuted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(249, 115, 22, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(249, 115, 22, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
