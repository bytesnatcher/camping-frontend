/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.8s cubic-bezier(0.215, 0.61, 0.35, 1) infinite',
        flame: 'flame 1s infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%, 75%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(10px)' },
        },
        flame: {
          '0%': { transform: 'scaleY(1)', opacity: '1' },
          '50%': { transform: 'scaleY(1.2)', opacity: '0.8' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
    variants: {
      extend: {
        display: ['group-hover'],
      },
    },
  },
  plugins: [],
}

