import React from 'react';
import { IPokemonMergedProps } from './PokemonParty';
import EvolvePokemonButton from './smallUI/EvolvePokemonButton';

// Type-based color mapping for card headers
const typeColors: Record<string, { from: string; to: string; border: string }> = {
  fire: { from: 'from-orange-500', to: 'to-red-600', border: 'border-orange-400' },
  water: { from: 'from-blue-400', to: 'to-blue-600', border: 'border-blue-400' },
  grass: { from: 'from-green-400', to: 'to-green-600', border: 'border-green-400' },
  electric: { from: 'from-yellow-400', to: 'to-amber-500', border: 'border-yellow-400' },
  ice: { from: 'from-cyan-300', to: 'to-cyan-500', border: 'border-cyan-300' },
  fighting: { from: 'from-red-600', to: 'to-red-800', border: 'border-red-500' },
  poison: { from: 'from-purple-400', to: 'to-purple-600', border: 'border-purple-400' },
  ground: { from: 'from-amber-600', to: 'to-amber-800', border: 'border-amber-500' },
  flying: { from: 'from-indigo-300', to: 'to-sky-400', border: 'border-indigo-300' },
  psychic: { from: 'from-pink-400', to: 'to-pink-600', border: 'border-pink-400' },
  bug: { from: 'from-lime-400', to: 'to-lime-600', border: 'border-lime-400' },
  rock: { from: 'from-stone-500', to: 'to-stone-700', border: 'border-stone-400' },
  ghost: { from: 'from-purple-600', to: 'to-indigo-800', border: 'border-purple-500' },
  dragon: { from: 'from-indigo-500', to: 'to-violet-700', border: 'border-indigo-400' },
  dark: { from: 'from-gray-700', to: 'to-gray-900', border: 'border-gray-600' },
  steel: { from: 'from-slate-400', to: 'to-slate-600', border: 'border-slate-400' },
  fairy: { from: 'from-pink-300', to: 'to-pink-500', border: 'border-pink-300' },
  normal: { from: 'from-slate-400', to: 'to-slate-600', border: 'border-slate-400' },
};

const getTypeColors = (types?: string[]) => {
  const primaryType = types?.[0]?.toLowerCase() || 'normal';
  return typeColors[primaryType] || typeColors.normal;
};

// Evolution tier glow styling
const getEvolutionGlow = (evolutions: number = 0) => {
  if (evolutions >= 2) {
    return { glowSize: 'w-40 h-40', glowOpacity: 'opacity-35', glowBlur: 'blur-md' };
  } else if (evolutions === 1) {
    return { glowSize: 'w-32 h-32', glowOpacity: 'opacity-25', glowBlur: 'blur-sm' };
  }
  return { glowSize: 'w-28 h-28', glowOpacity: 'opacity-20', glowBlur: 'blur-sm' };
};

interface IViewPokemonPage {
  selectedPokemonAtClick: IPokemonMergedProps;
  onClose?: () => void;
}

export const ViewPokemonPage: React.FC<IViewPokemonPage> = ({
  selectedPokemonAtClick,
  onClose,
}) => {
  const typeColor = getTypeColors(selectedPokemonAtClick?.types);
  const evolutionGlow = getEvolutionGlow(selectedPokemonAtClick?.evolutions || 0);

  return (
    <div className="w-full max-w-[500px] mx-auto">
      {selectedPokemonAtClick ? (
        <div className={`w-full rounded-xl shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col items-center border-2 ${typeColor.border} overflow-hidden`}>
          {/* Header - Name and Level with type color */}
          <div className={`flex justify-between w-full p-2 bg-gradient-to-r ${typeColor.from} ${typeColor.to} text-white rounded-t-lg shadow-md`}>
            <div className="capitalize font-bold text-lg flex items-center">
              {selectedPokemonAtClick.evolutions && selectedPokemonAtClick.evolutions >= 2 ? '✨✨ ' : selectedPokemonAtClick.evolutions === 1 ? '✨ ' : ''}
              {selectedPokemonAtClick.name}
              {selectedPokemonAtClick.nickname &&
                selectedPokemonAtClick.nickname !==
                selectedPokemonAtClick.pokedex_number.toString() && (
                  <span className="text-sm font-light italic ml-1">
                    ({selectedPokemonAtClick.nickname})
                  </span>
                )}
            </div>
            <div className="font-bold text-lg">
              Lvl. {selectedPokemonAtClick.level}
            </div>
          </div>

          {/* Type Badges */}
          <div className="flex justify-center gap-1.5 py-1.5 px-2 w-full bg-gray-50">
            {selectedPokemonAtClick.types?.map((type: string, idx: number) => (
              <span
                key={idx}
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full text-white shadow-sm bg-gradient-to-r ${typeColors[type.toLowerCase()]?.from || 'from-gray-400'} ${typeColors[type.toLowerCase()]?.to || 'to-gray-600'}`}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Image with gradient background and glow ring */}
          <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 p-2 flex justify-center items-center relative">
            {/* Type-colored glow ring - scales with evolution */}
            <div className={`absolute ${evolutionGlow.glowSize} rounded-full bg-gradient-to-br ${typeColor.from} ${typeColor.to} ${evolutionGlow.glowOpacity} ${evolutionGlow.glowBlur}`} />
            <img
              src={selectedPokemonAtClick.img}
              alt={selectedPokemonAtClick.name}
              className="w-[50%] h-auto object-contain max-h-[120px] relative z-10 drop-shadow-lg"
            />
          </div>

          {/* Health and Exp Bars Section */}
          <div className="w-full px-3 py-2">
            {/* Health bar */}
            <div className="mb-2">
              <div className="text-xs flex justify-between font-medium text-gray-700 mb-0.5">
                <span>Health:</span>
                <span>
                  {selectedPokemonAtClick.hp}/{selectedPokemonAtClick.maxHp}
                </span>
              </div>
              <div className="bg-gray-200 h-[10px] rounded-full shadow-inner">
                <div
                  style={{
                    width: `${(selectedPokemonAtClick.hp / selectedPokemonAtClick.maxHp) * 100}%`,
                    backgroundColor: (() => {
                      const percentage =
                        (selectedPokemonAtClick.hp /
                          selectedPokemonAtClick.maxHp) *
                        100;
                      if (percentage < 20) return '#EF4444'; // Red
                      if (percentage < 50) return '#F59E0B'; // Amber
                      return '#10B981'; // Green
                    })(),
                  }}
                  className="h-full rounded-full shadow transition-all duration-300"
                />
              </div>
            </div>

            {/* Stats Grid - Enhanced styling */}
            <div className="flex justify-between mb-2 gap-1">
              <div className="bg-gradient-to-b from-red-100 to-red-200 rounded-lg p-1.5 text-center flex-1 shadow-sm border border-red-200">
                <div className="text-[10px] text-red-600 font-semibold">⚔️ ATK</div>
                <div className="font-bold text-sm text-red-700">{selectedPokemonAtClick.attack}</div>
              </div>
              <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg p-1.5 text-center flex-1 shadow-sm border border-blue-200">
                <div className="text-[10px] text-blue-600 font-semibold">🛡️ DEF</div>
                <div className="font-bold text-sm text-blue-700">
                  {selectedPokemonAtClick.defense}
                </div>
              </div>
              <div className="bg-gradient-to-b from-green-100 to-green-200 rounded-lg p-1.5 text-center flex-1 shadow-sm border border-green-200">
                <div className="text-[10px] text-green-600 font-semibold">💨 SPD</div>
                <div className="font-bold text-sm text-green-700">{selectedPokemonAtClick.speed}</div>
              </div>
            </div>

            {/* Evolution Bonus Badge */}
            {selectedPokemonAtClick.hasEvolutionBonus && (
              <div className="bg-green-100 border border-green-500 text-green-700 px-2 py-1.5 rounded-lg text-xs font-medium mb-2 flex items-center">
                <span className="font-bold mr-1">★</span>
                {selectedPokemonAtClick.evolutionBonusText}
              </div>
            )}

            {/* Battle Statistics Card */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-2">
              <div className="font-semibold text-sm border-b pb-0.5 mb-1.5 text-blue-800">
                Battle Statistics
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="text-xs">
                  Battles fought:
                  <span className="font-bold ml-1">
                    {selectedPokemonAtClick.battlesFought}
                  </span>
                </div>

                <div className="text-xs">
                  Win rate:
                  <span className="font-bold ml-1">
                    {selectedPokemonAtClick.battlesFought > 0
                      ? Math.round(
                        (selectedPokemonAtClick.battlesWon /
                          selectedPokemonAtClick.battlesFought) *
                        100
                      )
                      : 0}
                    %
                  </span>
                </div>

                <div className="text-xs">
                  Wins:
                  <span className="font-bold text-green-600 ml-1">
                    {selectedPokemonAtClick.battlesWon}
                  </span>
                </div>

                <div className="text-xs">
                  Losses:
                  <span className="font-bold text-red-600 ml-1">
                    {selectedPokemonAtClick.battlesLost}
                  </span>
                </div>
              </div>
            </div>

            {/* Evolution Button */}
            <div className="my-2">
              <EvolvePokemonButton
                pokemonId={selectedPokemonAtClick.pokedex_number}
                onEvolutionComplete={onClose}
                className="w-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
