
"use client";
import React from 'react';
import { IPokemonMergedProps } from './PokemonParty';
import EvolvePokemonButton from './smallUI/EvolvePokemonButton';

import { getExpForNextLevelRawValue } from '../../store/relatedMappings/experienceMapping';
import { getTypeColors, typeColors } from '../utils/UI/typeColors';
// Function to calculate experience progress percentage for the level progress bar
function calculateExpProgressPercentage(pokemon: IPokemonMergedProps): number {
  const currentLevel = pokemon.level || 1;
  if (currentLevel === 1) {
    return (pokemon.experience / getExpForNextLevelRawValue(1)) * 100;
  }
  const currentLevelExp = getExpForNextLevelRawValue(currentLevel - 1);
  const nextLevelExp = getExpForNextLevelRawValue(currentLevel);
  const expInCurrentLevel = pokemon.experience - currentLevelExp;
  const expRequiredForNextLevel = nextLevelExp - currentLevelExp;
  return (expInCurrentLevel / expRequiredForNextLevel) * 100;
}

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
          <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 py-1 flex justify-center items-center relative">
            {/* Type-colored glow ring - scales with evolution */}
            <div className={`absolute ${evolutionGlow.glowSize} rounded-full bg-gradient-to-br ${typeColor.from} ${typeColor.to} ${evolutionGlow.glowOpacity} ${evolutionGlow.glowBlur}`} />
            <img
              src={selectedPokemonAtClick.img}
              alt={selectedPokemonAtClick.name}
              className="w-[40%] h-auto object-contain max-h-[80px] relative z-10 drop-shadow-lg"
            />
          </div>

          {/* Health and Exp Bars Section */}
          <div className="w-full px-3 py-1">
            {/* Health bar */}
            <div className="mb-1">
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

            {/* EXP bar */}
            <div className="w-full p-1.5">
              <div className="text-xs flex justify-between font-medium text-gray-700 mb-1">
                <span>Experience:</span>
                <span>
                  {selectedPokemonAtClick.experience}/
                  {getExpForNextLevelRawValue(selectedPokemonAtClick.level)}
                </span>
              </div>
              <div className="bg-gray-200 h-[8px] rounded-full shadow-inner">
                <div
                  style={{
                    width: `${calculateExpProgressPercentage(selectedPokemonAtClick)}%`,
                    backgroundColor: `hsl(45, 90%, ${80 - calculateExpProgressPercentage(selectedPokemonAtClick) * 0.3}%)`,
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Stats Grid - Enhanced styling */}
            <div className="flex  justify-between mb-1 gap-1">
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
              <div className="bg-green-100 border border-green-500 text-green-700 px-2 py-1 rounded-lg text-xs font-medium mb-1 flex items-center">
                <span className="font-bold mr-1">★</span>
                {selectedPokemonAtClick.evolutionBonusText}
              </div>
            )}

            {/* Battle Statistics Card */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-1">
              <div className="font-semibold text-sm border-b pb-0.5 mb-1 text-blue-800">
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
            <div className="mt-1">
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
