import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // Laptop-sized and up, but only when there is also enough height.
        // The battle screen uses these so its larger layout never squeezes
        // the Pokemon out on short laptop screens.
        tall: { raw: '(min-width: 1024px) and (min-height: 760px)' },
        xtall: { raw: '(min-width: 1280px) and (min-height: 760px)' },
      },
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
        // Battle screen
        'battle-bob': 'battleBob 3s ease-in-out infinite',
        'card-in-left': 'cardInLeft 0.45s ease-out backwards',
        'card-in-right': 'cardInRight 0.45s ease-out backwards',
        'damage-float': 'damageFloat 1.1s ease-out forwards',
        'ball-throw': 'ballThrow 1.5s ease-in-out forwards',
        'ball-break': 'ballBreak 0.35s ease-out forwards',
        'ball-settle': 'ballSettle 0.5s ease-out forwards',
        'catch-burst': 'catchBurst 0.8s ease-out forwards',
        'overlay-in': 'overlayIn 0.3s ease-out backwards',
      },
      keyframes: {
        battleBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        cardInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-48px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        cardInRight: {
          '0%': { opacity: '0', transform: 'translateX(48px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        damageFloat: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.5)' },
          '15%': { opacity: '1', transform: 'translateY(0) scale(1.35)' },
          '30%': { opacity: '1', transform: 'translateY(-6px) scale(1)' },
          '75%': { opacity: '1', transform: 'translateY(-34px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-48px) scale(1)' },
        },
        // The ball flies in from the player's side, lands, then rocks three times.
        ballThrow: {
          '0%': {
            opacity: '0',
            transform: 'translate(-260%, 40%) rotate(-540deg) scale(0.6)',
          },
          '5%': { opacity: '1' },
          '18%': { transform: 'translate(-40%, -70%) rotate(-90deg) scale(1)' },
          '27%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '31%': { transform: 'translate(0, -14%) rotate(0deg) scale(1)' },
          '36%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '46%': { transform: 'translate(-8%, 0) rotate(-22deg) scale(1)' },
          '56%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '66%': { transform: 'translate(8%, 0) rotate(22deg) scale(1)' },
          '76%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '86%': { transform: 'translate(-6%, 0) rotate(-16deg) scale(1)' },
          '94%, 100%': {
            opacity: '1',
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
          },
        },
        ballBreak: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.9)' },
        },
        ballSettle: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(0.85)' },
          '100%': { transform: 'scale(1)' },
        },
        catchBurst: {
          '0%': { opacity: '0.9', transform: 'scale(0.4)' },
          '100%': { opacity: '0', transform: 'scale(2.6)' },
        },
        overlayIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
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
