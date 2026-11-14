import { animated, useSpring } from '@react-spring/web';
import React, { useEffect, useRef, useState } from 'react';
import { pokeData } from '../../../../store/pokemonDataStore';
import { getExpForNextLevelRawValue } from '../../../../store/relatedMappings/experienceMapping';
import userPokemonDetailsStore from '../../../../store/userPokemonDetailsStore';
import Pokemon from '../../../utils/pokemonToBattleHelpers';
import { IPokemonMergedProps } from '../../PokemonParty';
import HealthLostAnimation, { IHealFx, IHitFx } from './HealthLostAnimation';
import { MOVE_STAT_SHORT_LABELS, MoveStat } from '../../../utils/moves';
import { getTypeColors, typeColors } from '../../../utils/UI/typeColors';

// Where a Pokeball throw is up to, so the opponent card can act it out.
export interface ICatchFx {
  phase: 'idle' | 'throwing' | 'caught' | 'escaped';
  ball: 'Pokeball' | 'Golden';
}

// If a hit animation never arrives, the HP bar catches up after this long.
const HP_SYNC_FALLBACK_MS = 800;

// Plays a one-off animation on an element without re-rendering it. Skipped
// where the browser can't do it or the user has asked for reduced motion.
function playOnce(
  element: HTMLElement | null,
  keyframes: Keyframe[],
  duration: number
) {
  if (!element || typeof element.animate !== 'function') return;
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  element.animate(keyframes, { duration, easing: 'ease-in-out' });
}

interface IBattleCard {
  pokemon: IPokemonMergedProps | pokeData;
  isLoggedInUser: boolean;
  pokemonClass: Pokemon;
  isPlayer: boolean;
  winner: string;
  playerHP: number;
  opponentPokemon?: pokeData; // Optional opponent Pokemon for type effectiveness calculation
  activeMove?: string | null; // Currently active move for animation
  attackTick: number; // Goes up by one each time this Pokemon attacks
  hitFx: IHitFx; // The latest attack to land on (or miss) this Pokemon
  catchFx?: ICatchFx; // Only given to the opponent card
}

const BattleCard: React.FC<IBattleCard> = ({
  pokemon,
  isLoggedInUser,
  pokemonClass,
  isPlayer,
  winner,
  playerHP,
  opponentPokemon,
  activeMove,
  attackTick,
  hitFx,
  catchFx,
}) => {

  let multiLayerShadow =
    'shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)]';

  let winnerShadow =
    'shadow-[0_10px_15px_rgba(16,185,129,0.3),0_4px_6px_rgba(16,185,129,0.2)]';

  let loserShadow =
    'shadow-[0_10px_15px_rgba(239,68,68,0.3),0_4px_6px_rgba(239,68,68,0.2)]';

  const currentPokemonFromStore = userPokemonDetailsStore(
    (state) => state.userPokemonData
  ).find(
    (pokemonData) => pokemonData.pokedex_number === pokemon.pokedex_number
  );

  // The real HP: the store for the player, the battle class for the opponent.
  const actualHp = isPlayer
    ? (currentPokemonFromStore?.remainingHp ?? pokemon.hp)
    : pokemonClass.hp;

  // The HP on screen. Damage is held back until the hit animation lands so the
  // bar doesn't drop before the attack is seen; healing shows straight away.
  const [shownHp, setShownHp] = useState(actualHp);
  const [healFx, setHealFx] = useState<IHealFx>({ tick: 0, amount: 0 });
  const actualHpRef = useRef(actualHp);
  actualHpRef.current = actualHp;
  const previousActualHp = useRef(actualHp);

  useEffect(() => {
    const previous = previousActualHp.current;
    previousActualHp.current = actualHp;
    if (actualHp === previous) return;
    if (actualHp > previous) {
      setShownHp(actualHp);
      setHealFx((fx) => ({ tick: fx.tick + 1, amount: actualHp - previous }));
      return;
    }
    const fallback = setTimeout(
      () => setShownHp(actualHp),
      HP_SYNC_FALLBACK_MS
    );
    return () => clearTimeout(fallback);
  }, [actualHp]);

  const lungeRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Lunge toward the other Pokemon when this one attacks.
  useEffect(() => {
    if (attackTick === 0) return;
    const direction = isPlayer ? 1 : -1;
    playOnce(
      lungeRef.current,
      [
        { transform: 'translateX(0) scale(1)' },
        { transform: `translateX(${-10 * direction}%) scale(0.96)`, offset: 0.2 },
        { transform: `translateX(${32 * direction}%) scale(1.12)`, offset: 0.5 },
        { transform: 'translateX(0) scale(1)' },
      ],
      420
    );
  }, [attackTick]);

  // Shake and flash when hit, or sidestep when the attack is dodged.
  useEffect(() => {
    if (hitFx.tick === 0) return;
    setShownHp(actualHpRef.current);
    const away = isPlayer ? -1 : 1;
    if (hitFx.dodged) {
      playOnce(
        hitRef.current,
        [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: `translateX(${28 * away}%)`, opacity: 0.55, offset: 0.4 },
          { transform: 'translateX(0)', opacity: 1 },
        ],
        380
      );
      return;
    }
    const shake = hitFx.critical ? 13 : 7;
    playOnce(
      hitRef.current,
      [
        { transform: 'translateX(0)', filter: 'brightness(1)' },
        { transform: `translateX(${shake * away}px)`, filter: 'brightness(3)', offset: 0.15 },
        { transform: `translateX(${-shake * away}px)`, filter: 'brightness(1)', offset: 0.35 },
        { transform: `translateX(${shake * 0.6 * away}px)`, filter: 'brightness(1.8)', offset: 0.55 },
        { transform: `translateX(${-shake * 0.4 * away}px)`, filter: 'brightness(1)', offset: 0.75 },
        { transform: 'translateX(0)', filter: 'brightness(1)' },
      ],
      hitFx.critical ? 520 : 420
    );
    playOnce(
      flashRef.current,
      [
        { opacity: 0 },
        { opacity: hitFx.critical ? 0.6 : 0.4, offset: 0.2 },
        { opacity: 0 },
      ],
      420
    );
  }, [hitFx.tick]);

  const hasFainted = shownHp <= 0;
  const isLowHp = !hasFainted && shownHp / pokemon.maxHp < 0.2;
  const isInsideBall =
    catchFx?.phase === 'throwing' || catchFx?.phase === 'caught';

  // Use react-spring to animate the HP change
  const { hpAnimated } = useSpring({
    hpAnimated: shownHp,
    from: { hpAnimated: pokemon.hp }, // Start from full health
    config: { tension: 300, friction: 20 }, // Faster animation with less friction
  });

  let rawExpTillNextLevel = getExpForNextLevelRawValue(
    currentPokemonFromStore?.level || 1
  );

  const { expAnimated } = useSpring({
    expAnimated: currentPokemonFromStore?.experience, // Use the class HP for animation
    from: {
      expAnimated: currentPokemonFromStore?.experience,
    }, // Start from full health
    config: { tension: 180, friction: 40 }, // Adjust the physics of the animation
  });

  // For opponent Pokémon, we'll use the stats from the pokemonClass object
  // rather than modifying the pokemon object, to avoid re-render issues

  // Arrows after a stat that a move has raised or lowered this battle.
  function stageArrow(stat: MoveStat) {
    const stage = pokemonClass.stages[stat];
    if (!stage) return null;
    return (
      <span className={stage > 0 ? 'text-green-600' : 'text-red-600'}>
        {' '}
        {(stage > 0 ? '▲' : '▼').repeat(Math.abs(stage))}
      </span>
    );
  }

  // Accuracy and evasion have no stat box, so they get a small tag when changed.
  const hiddenStatTags = (['accuracy', 'evasion'] as MoveStat[]).filter(
    (stat) => pokemonClass.stages[stat] !== 0
  );

  function getPokemoneFightValues(pokemon: IPokemonMergedProps | pokeData) {
    return (
      <div className="w-full">
        {/* Stats grid - inline with no wrapper padding */}
        <div className="flex justify-between gap-1 tall:gap-2 mb-1 tall:mb-2">
          <div className="bg-gradient-to-b from-red-100 to-red-200 rounded px-1.5 py-0.5 tall:py-1 text-center flex-1 shadow-sm border border-red-200">
            <div className="text-[8px] sm:text-[10px] tall:text-xs text-red-600 font-semibold">⚔️ ATK</div>
            <div className="font-bold text-[10px] sm:text-xs tall:text-base text-red-700">
              {Math.round(pokemonClass.effective('attack'))}
              {stageArrow('attack')}
            </div>
          </div>
          <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded px-1.5 py-0.5 tall:py-1 text-center flex-1 shadow-sm border border-blue-200">
            <div className="text-[8px] sm:text-[10px] tall:text-xs text-blue-600 font-semibold">🛡️ DEF</div>
            <div className="font-bold text-[10px] sm:text-xs tall:text-base text-blue-700">
              {Math.round(pokemonClass.effective('defense'))}
              {stageArrow('defense')}
            </div>
          </div>
          <div className="bg-gradient-to-b from-green-100 to-green-200 rounded px-1.5 py-0.5 tall:py-1 text-center flex-1 shadow-sm border border-green-200">
            <div className="text-[8px] sm:text-[10px] tall:text-xs text-green-600 font-semibold">💨 SPD</div>
            <div className="font-bold text-[10px] sm:text-xs tall:text-base text-green-700">
              {Math.round(pokemonClass.effective('speed'))}
              {stageArrow('speed')}
            </div>
          </div>
        </div>

        {hiddenStatTags.length > 0 && (
          <div className="flex justify-center gap-1 mb-1">
            {hiddenStatTags.map((stat) => (
              <span
                key={stat}
                className="rounded bg-gray-100 border border-gray-300 px-1 text-[9px] tall:text-xs font-semibold text-gray-700"
              >
                {MOVE_STAT_SHORT_LABELS[stat]}
                {stageArrow(stat)}
              </span>
            ))}
          </div>
        )}

        {/* Moves section - compact inline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0.5 tall:gap-1">
          {pokemon.moves.slice(0, 4).map((move, index) => {
            const isActiveMove = activeMove && move.toLowerCase() === activeMove.toLowerCase();
            return (
              <div
                key={index}
                className={`border rounded px-0.5 py-0.5 tall:px-1 tall:py-1 text-center text-[9px] tall:text-xs xtall:text-sm capitalize truncate transition-all duration-300 ${isActiveMove
                  ? 'text-gray-900 bg-yellow-300 border-yellow-500 animate-pulse scale-110 font-bold shadow-lg shadow-yellow-400/50 z-10'
                  : 'text-gray-800 bg-blue-50 border-blue-200'
                  }`}
              >
                {move.replace(/-/g, ' ')}
              </div>
            );
          })}
        </div>
      </div>
    );
  }


  if (pokemon) {
    const typeColor = getTypeColors(pokemon.types);

    return (
      <div
        className={`h-full sm:h-[90%] tall:h-[98%] w-full max-w-[320px] tall:max-w-[400px] xtall:max-w-[460px] rounded-lg tall:rounded-xl shadow-lg ${isPlayer ? 'motion-safe:animate-card-in-left' : 'motion-safe:animate-card-in-right'} ${winner == 'player' && isPlayer
          ? 'bg-gradient-to-br from-green-50 to-green-100 ' + winnerShadow
          : winner == 'opponent' && !isPlayer
            ? 'bg-gradient-to-br from-green-50 to-green-100 ' + winnerShadow
            : winner != ''
              ? 'bg-gradient-to-br from-red-50 to-red-100 ' + loserShadow
              : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 ' +
              multiLayerShadow
          } flex flex-col border-2 ${typeColor.border} overflow-hidden`}
      >
        {/* Header - Name and Level with type color */}
        <div className={`flex justify-between w-full px-2 py-1 tall:px-3 tall:py-2 bg-gradient-to-r ${typeColor.from} ${typeColor.to} text-white`}>
          <div className="capitalize font-bold text-xs sm:text-sm tall:text-lg min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {pokemon.name}
            {'nickname' in pokemon && pokemon.nickname ? (
              <span className="text-[10px] sm:text-xs tall:text-sm font-light italic ml-1">
                ({pokemon.nickname})
              </span>
            ) : null}
          </div>
          <div className="font-bold text-xs sm:text-sm tall:text-lg whitespace-nowrap ml-1">
            Lvl. {isPlayer ? currentPokemonFromStore?.level || 1 : pokemon.opponentLevel || 1}
          </div>
        </div>

        {/* Health bar */}
        <div className="w-full px-2 py-1 tall:px-3 tall:pt-2">
          <div className="text-[9px] sm:text-[10px] tall:text-sm flex justify-between font-medium text-gray-700">
            <span>HP:</span>
            <span>
              <span>{shownHp.toString()}</span>
              /{pokemon.maxHp.toString()}
            </span>
          </div>
          <div className="bg-gray-200 h-[8px] sm:h-[10px] tall:h-3.5 rounded-full shadow-inner">
            <animated.div
              style={{
                width: hpAnimated.to((hp) => `${(hp / pokemon.maxHp) * 100}%`),
                backgroundColor: hpAnimated.to((hp) => {
                  const percentage = (hp / pokemon.maxHp) * 100;
                  if (percentage < 20) return '#EF4444';
                  if (percentage < 50) return '#F59E0B';
                  return '#10B981';
                }),
              }}
              className={`h-full rounded-full shadow transition-all duration-300 ${isLowHp ? 'motion-safe:animate-pulse' : ''}`}
            />
          </div>
        </div>

        {/* Bonus/EXP row - fixed height to keep cards consistent */}
        <div className="h-6 sm:h-7 tall:h-9 px-2 tall:px-3 flex items-center">
          {isPlayer && 'hasEvolutionBonus' in pokemon && pokemon.hasEvolutionBonus ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tall:text-xs flex items-center">
              <span className="font-bold mr-0.5">★</span>
              {pokemon.evolutionBonusText}
            </div>
          ) : isPlayer ? (
            <div className="w-full">
              <div className="text-[8px] sm:text-[9px] tall:text-xs flex justify-between font-medium text-gray-600">
                <span>EXP:</span>
                <span>{currentPokemonFromStore?.experience ?? 0}/{rawExpTillNextLevel ?? 0}</span>
              </div>
              <div className="bg-gray-200 h-[5px] tall:h-2 rounded-full shadow-inner">
                <animated.div
                  style={{
                    width: expAnimated!.to((exp) => {
                      const prevLevel = (currentPokemonFromStore?.level || 1) - 1;
                      const baseExp = prevLevel > 0 ? (getExpForNextLevelRawValue(prevLevel) ?? 0) : 0;
                      const endExp = rawExpTillNextLevel ?? 1;
                      const progress = endExp - baseExp > 0 ? Math.max(0, Math.min((exp - baseExp) / (endExp - baseExp), 1)) : 0;
                      return `${progress * 100}%`;
                    }),
                    backgroundColor: '#F59E0B',
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>
          ) : (
            /* Placeholder for opponent to maintain same height */
            <div className="w-full opacity-0 pointer-events-none">
              <div className="text-[8px]">—</div>
            </div>
          )}
        </div>

        {/* Main content: Stats then Image stacked */}
        <div className="flex-1 min-h-0 flex flex-col w-full px-1.5 py-1 tall:px-3 tall:py-2">
          {/* Stats row */}
          <div className="w-full">
            {getPokemoneFightValues(pokemon)}
          </div>

          {/* Image - centered below stats with glow */}
          <div className="flex-1 min-h-0 flex items-center justify-center relative">
            {/* Type-colored glow ring */}
            <div className={`absolute w-20 h-20 sm:w-28 sm:h-28 tall:w-40 tall:h-40 xtall:w-48 xtall:h-48 rounded-full bg-gradient-to-br ${typeColor.from} ${typeColor.to} opacity-25 blur-md`} />
            {/* Red flash when a hit lands */}
            <div
              ref={flashRef}
              className="absolute inset-0 opacity-0 pointer-events-none bg-[radial-gradient(circle,rgba(239,68,68,0.9)_0%,transparent_65%)]"
            />
            <HealthLostAnimation hitFx={hitFx} healFx={healFx} />
            {/* Each wrapper carries one kind of movement so they can overlap:
                lunge when attacking, shake when hit, then faint / pulled into a ball. */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div ref={lungeRef} className="h-full flex items-center justify-center">
              <div ref={hitRef} className="h-full flex items-center justify-center">
                <div
                  className={`h-full flex items-center justify-center transition-all ${hasFainted
                    ? 'duration-700 ease-in translate-y-[35%] opacity-0 grayscale'
                    : isInsideBall
                      ? 'duration-300 delay-[380ms] ease-in scale-0 opacity-0 brightness-[3]'
                      : 'duration-300 ease-out scale-100 opacity-100'
                    }`}
                >
                  <img
                    alt={`${pokemon.name} in battle`}
                    className={`h-full max-h-28 sm:max-h-36 tall:max-h-52 xtall:max-h-60 w-auto object-contain drop-shadow-lg [image-rendering:pixelated] ${hasFainted || isInsideBall ? '' : 'motion-safe:animate-battle-bob'} ${isPlayer ? '' : '[animation-delay:-1.5s]'}`}
                    src={pokemon.img}
                  />
                </div>
              </div>
            </div>
            </div>
            {/* Pokeball throw: flies in, rocks, then either holds or breaks open */}
            {catchFx && catchFx.phase !== 'idle' && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                {catchFx.phase === 'caught' && (
                  <>
                    <div className="absolute w-12 h-12 tall:w-16 tall:h-16 rounded-full border-4 border-yellow-300 opacity-0 animate-catch-burst motion-reduce:animate-none" />
                    <div className="absolute w-12 h-12 tall:w-16 tall:h-16 rounded-full border-2 border-white opacity-0 animate-catch-burst [animation-delay:150ms] motion-reduce:animate-none" />
                  </>
                )}
                <img
                  key={catchFx.phase}
                  alt=""
                  src={catchFx.ball === 'Golden' ? '/GoldBall.png' : '/ball.png'}
                  className={`w-10 h-10 sm:w-12 sm:h-12 tall:w-16 tall:h-16 origin-bottom drop-shadow-lg motion-reduce:animate-none ${catchFx.phase === 'throwing'
                    ? 'animate-ball-throw'
                    : catchFx.phase === 'escaped'
                      ? 'animate-ball-break'
                      : 'animate-ball-settle'
                    }`}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }
};

export default BattleCard;
