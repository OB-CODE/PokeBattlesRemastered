import { animated, useSpring } from '@react-spring/web';
import React from 'react';
import { pokeData } from '../../../../store/pokemonDataStore';
import { getExpForNextLevelRawValue } from '../../../../store/relatedMappings/experienceMapping';
import userPokemonDetailsStore from '../../../../store/userPokemonDetailsStore';
import Pokemon from '../../../utils/pokemonToBattleHelpers';
import { IPokemonMergedProps } from '../../PokemonParty';
import HealthLostAnimation from './HealthLostAnimation';
import TypeEffectiveness from './TypeEffectiveness';
import { getTypeColors, typeColors } from '../../../utils/UI/typeColors';

interface IBattleCard {
  pokemon: IPokemonMergedProps | pokeData;
  isLoggedInUser: boolean;
  pokemonClass: Pokemon;
  isPlayer: boolean;
  playerDamageSustained: number;
  opponentDamageSustained: number;
  winner: string;
  playerHP: number;
  opponentPokemon?: pokeData; // Optional opponent Pokemon for type effectiveness calculation
  activeMove?: string | null; // Currently active move for animation
}

const BattleCard: React.FC<IBattleCard> = ({
  pokemon,
  isLoggedInUser,
  pokemonClass,
  isPlayer,
  playerDamageSustained,
  opponentDamageSustained,
  winner,
  playerHP,
  opponentPokemon,
  activeMove,
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

  // Use react-spring to animate the HP change, with different logic for player vs opponent
  const { hpAnimated } = useSpring({
    hpAnimated: isPlayer
      ? currentPokemonFromStore?.remainingHp
      : pokemonClass.hp, // Use the class HP for animation
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

  function getPokemoneFightValues(pokemon: IPokemonMergedProps | pokeData) {
    return (
      <div className="w-full">
        {/* Stats grid - inline with no wrapper padding */}
        <div className="flex justify-between gap-1 mb-1">
          <div className="bg-gradient-to-b from-red-100 to-red-200 rounded px-1.5 py-0.5 text-center flex-1 shadow-sm border border-red-200">
            <div className="text-[8px] sm:text-[10px] text-red-600 font-semibold">⚔️ ATK</div>
            <div className="font-bold text-[10px] sm:text-xs text-red-700">
              {pokemon.attack.toString()}
            </div>
          </div>
          <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded px-1.5 py-0.5 text-center flex-1 shadow-sm border border-blue-200">
            <div className="text-[8px] sm:text-[10px] text-blue-600 font-semibold">🛡️ DEF</div>
            <div className="font-bold text-[10px] sm:text-xs text-blue-700">
              {pokemon.defense.toString()}
            </div>
          </div>
          <div className="bg-gradient-to-b from-green-100 to-green-200 rounded px-1.5 py-0.5 text-center flex-1 shadow-sm border border-green-200">
            <div className="text-[8px] sm:text-[10px] text-green-600 font-semibold">💨 SPD</div>
            <div className="font-bold text-[10px] sm:text-xs text-green-700">
              {pokemon.speed.toString()}
            </div>
          </div>
        </div>

        {/* Moves section - compact inline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0.5">
          {pokemon.moves.slice(0, 4).map((move, index) => {
            const isActiveMove = activeMove && move.toLowerCase() === activeMove.toLowerCase();
            return (
              <div
                key={index}
                className={`border rounded px-0.5 py-0.5 text-center text-[9px] capitalize truncate transition-all duration-300 ${isActiveMove
                  ? 'bg-yellow-300 border-yellow-500 animate-pulse scale-110 font-bold shadow-lg shadow-yellow-400/50 z-10'
                  : 'bg-blue-50 border-blue-200'
                  }`}
              >
                {move}
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
        className={`h-full sm:h-[90%] w-full max-w-[320px] rounded-lg shadow-lg ${winner == 'player' && isPlayer
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
        <div className={`flex justify-between w-full px-2 py-1 bg-gradient-to-r ${typeColor.from} ${typeColor.to} text-white`}>
          <div className="capitalize font-bold text-xs sm:text-sm min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {pokemon.name}
            {'nickname' in pokemon && pokemon.nickname ? (
              <span className="text-[10px] sm:text-xs font-light italic ml-1">
                ({pokemon.nickname})
              </span>
            ) : null}
          </div>
          <div className="font-bold text-xs sm:text-sm whitespace-nowrap ml-1">
            Lvl. {isPlayer ? currentPokemonFromStore?.level || 1 : pokemon.opponentLevel || 1}
          </div>
        </div>

        {/* Health bar */}
        <div className="w-full px-2 py-1">
          <div className="text-[9px] sm:text-[10px] flex justify-between font-medium text-gray-700">
            <span>HP:</span>
            <span>
              <animated.span>
                {isPlayer ? currentPokemonFromStore?.remainingHp.toString() : pokemonClass.hp.toString()}
              </animated.span>
              /{pokemon.maxHp.toString()}
            </span>
          </div>
          <div className="bg-gray-200 h-[8px] sm:h-[10px] rounded-full shadow-inner">
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
              className="h-full rounded-full shadow transition-all duration-300"
            />
          </div>
        </div>

        {/* Bonus/EXP row - fixed height to keep cards consistent */}
        <div className="h-6 sm:h-7 px-2 flex items-center">
          {isPlayer && 'hasEvolutionBonus' in pokemon && pokemon.hasEvolutionBonus ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] flex items-center">
              <span className="font-bold mr-0.5">★</span>
              {pokemon.evolutionBonusText}
            </div>
          ) : isPlayer ? (
            <div className="w-full">
              <div className="text-[8px] sm:text-[9px] flex justify-between font-medium text-gray-600">
                <span>EXP:</span>
                <span>{currentPokemonFromStore?.experience ?? 0}/{rawExpTillNextLevel ?? 0}</span>
              </div>
              <div className="bg-gray-200 h-[5px] rounded-full shadow-inner">
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
        <div className="flex-1 min-h-0 flex flex-col w-full px-1.5 py-1">
          {/* Stats row */}
          <div className="w-full">
            {getPokemoneFightValues(pokemon)}
          </div>

          {/* Image - centered below stats with glow */}
          <div className="flex-1 min-h-0 flex items-center justify-center relative">
            {/* Type-colored glow ring */}
            <div className={`absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${typeColor.from} ${typeColor.to} opacity-25 blur-md`} />
            <HealthLostAnimation
              isPlayer={isPlayer}
              playerDamageSustained={playerDamageSustained}
              opponentDamageSustained={opponentDamageSustained}
            />
            <img
              alt={`${pokemon.name} in battle`}
              className="h-full max-h-28 sm:max-h-36 w-auto object-contain drop-shadow-lg relative z-10"
              src={pokemon.img}
            />
          </div>
        </div>

        {/* Type effectiveness - at bottom */}
        {winner === '' && opponentPokemon && (
          <div className="px-2 py-0.5 bg-gray-50 border-t border-gray-200">
            <TypeEffectiveness
              attackerPokedexNumber={pokemon.pokedex_number}
              defenderPokedexNumber={isPlayer ? opponentPokemon.pokedex_number : (opponentPokemon as any).pokedex_number}
              attackerTypes={pokemon.types}
              defenderTypes={isPlayer ? opponentPokemon.types : (opponentPokemon as any).types}
              attackerName={pokemon.name}
              defenderName={isPlayer ? opponentPokemon.name : (opponentPokemon as any).name}
            />
          </div>
        )}
      </div>
    );
  }
};

export default BattleCard;
