import React from 'react';

// One visual "something landed on this Pokemon" event. The tick goes up by one
// each time, so the same damage twice in a row still replays the animation.
export interface IHitFx {
  tick: number;
  damage: number;
  dodged: boolean;
  critical: boolean;
  missed?: boolean; // the attacker's move missed (shown like a dodge)
}

export interface IHealFx {
  tick: number;
  amount: number;
}

interface IHealthLost {
  hitFx: IHitFx;
  healFx?: IHealFx;
}

const outline =
  '[text-shadow:-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff,1px_1px_0_#fff,0_2px_4px_rgba(0,0,0,0.35)]';

// Numbers that pop up over the Pokemon, drift upward and fade out.
const HealthLostAnimation = ({ hitFx, healFx }: IHealthLost) => {
  return (
    <div className="absolute z-20 top-[12%] left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
      {hitFx.tick > 0 && (
        <div
          key={`hit-${hitFx.tick}`}
          className={`animate-damage-float font-extrabold ${outline} ${
            hitFx.dodged
              ? 'text-sky-600 text-base sm:text-lg lg:text-xl'
              : hitFx.critical
                ? 'text-orange-500 text-2xl sm:text-3xl lg:text-4xl'
                : 'text-red-600 text-xl sm:text-2xl lg:text-3xl'
          }`}
        >
          {hitFx.dodged
            ? hitFx.missed
              ? 'Missed!'
              : 'Dodged!'
            : `-${hitFx.damage}${hitFx.critical ? '!' : ''}`}
        </div>
      )}
      {healFx && healFx.tick > 0 && (
        <div
          key={`heal-${healFx.tick}`}
          className={`absolute top-0 left-1/2 -translate-x-1/2`}
        >
          <div
            className={`animate-damage-float font-extrabold text-green-600 text-xl sm:text-2xl lg:text-3xl ${outline}`}
          >
            +{healFx.amount}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthLostAnimation;
