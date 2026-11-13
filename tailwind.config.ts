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
        'fade-up': 'fadeUp 1.5s ease-out forwards',
        float: 'float 4s ease-in-out infinite',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        'rise-in': 'riseIn 0.6s ease-out backwards',
        'glow-pulse': 'glowPulse 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-12deg)' },
          '75%': { transform: 'rotate(12deg)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
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
        fadeUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
