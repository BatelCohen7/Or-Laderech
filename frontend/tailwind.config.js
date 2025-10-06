/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // פלטת צבעים יוקרתית ומודרנית
        gold: {
          50: '#fefcf3',
          100: '#fef7e0',
          200: '#fdecc4',
          300: '#fbdc9d',
          400: '#f8c76f',
          500: '#D4AF37', // זהב יוקרתי
          600: '#b8941f',
          700: '#9a7c1a',
          800: '#7f6319',
          900: '#6b5118',
        },
        warmGold: {
          50: '#fefaf5',
          100: '#fef4e8',
          200: '#fde6c8',
          300: '#fbd49d',
          400: '#f8be6f',
          500: '#E3A857', // זהב חם
          600: '#d4941f',
          700: '#b17c1a',
          800: '#8f6519',
          900: '#755318',
        },
        cream: {
          50: '#fefefe',
          100: '#fefcfa',
          200: '#fdf8f3',
          300: '#fbf2e8',
          400: '#F5F1EB', // שמנת
          500: '#f0e6d7',
          600: '#e6d4b8',
          700: '#d4bd94',
          800: '#bfa370',
          900: '#a68a54',
        },
        navy: {
          50: '#f0f5fa',
          100: '#dce7f3',
          200: '#b9cfe7',
          300: '#96b7db',
          400: '#739fcf',
          500: '#5087c3',
          600: '#3a6dab',
          700: '#2d5689',
          800: '#1e3c5a',
          900: '#0f1e2d',
        },
        sand: {
          50: '#fcfaf5',
          100: '#f8f4eb',
          200: '#f1e9d7',
          300: '#e9ddc3',
          400: '#e2d2af',
          500: '#dbc79b',
          600: '#c4b387',
          700: '#a99973',
          800: '#8e7f5f',
          900: '#73654b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // צבעים נוספים לעמודים השונים
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fef7e0',
          100: '#fdecc4',
          200: '#fbdc9d',
          300: '#f8c76f',
          400: '#E3A857',
          500: '#D4AF37',
          600: '#b8941f',
          700: '#9a7c1a',
          800: '#7f6319',
          900: '#6b5118',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        'hebrew': ['Alef', 'Assistant', 'system-ui', 'Arial', 'sans-serif'],
        'sans': ['Assistant', 'Alef', 'system-ui', 'Arial', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'shimmer-gold': 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(212, 175, 55, 0.15)',
        'luxury-lg': '0 20px 60px rgba(212, 175, 55, 0.25)',
        'elegant': '0 25px 50px rgba(212, 175, 55, 0.15)',
        'elegant-lg': '0 35px 70px rgba(212, 175, 55, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: []
};