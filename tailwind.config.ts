import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#F7F7F5',
          100: '#EFEFEB',
          200: '#D8D8D0',
          300: '#B8B8AC',
          400: '#888878',
          500: '#666658',
          600: '#4A4A3E',
          700: '#333328',
          800: '#1E1E16',
          900: '#0F0F0A',
        },
        clay: {
          50: '#FDF5F0',
          100: '#FAE8DC',
          200: '#F5CEB8',
          300: '#EFB090',
          400: '#E8906A',
          500: '#E07248',
          600: '#C55A30',
          700: '#9E4424',
          800: '#78311A',
          900: '#521F10',
        },
        sage: {
          50: '#F2F7F4',
          100: '#E0EDE5',
          200: '#C0DACB',
          300: '#97C2A9',
          400: '#6BA484',
          500: '#4A8863',
          600: '#376B4D',
          700: '#28523A',
          800: '#1B3A28',
          900: '#0F2418',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.04), 0 4px 16px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 4px 8px 0 rgba(0,0,0,0.06), 0 12px 32px 0 rgba(0,0,0,0.10)',
        'soft': '0 2px 8px 0 rgba(0,0,0,0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
