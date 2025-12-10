import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        fadeIn: 'fadeIn 0.2s ease-in-out',
        'bounce-glow': 'bounceGlow 0.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGlow: {
          '0%, 100%': {
            transform: 'scale(1) translateY(0)',
            boxShadow: '0 0 20px 10px rgba(239, 68, 68, 0.8)',
          },
          '50%': {
            transform: 'scale(1.08) translateY(-3px)',
            boxShadow: '0 0 30px 15px rgba(239, 68, 68, 1)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
