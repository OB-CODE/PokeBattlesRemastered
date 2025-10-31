import React from 'react';
import { IPokemonMergedProps } from './PokemonParty';
import EvolvePokemonButton from './smallUI/EvolvePokemonButton';

interface IViewPokemonPage {
  selectedPokemonAtClick: IPokemonMergedProps;
  onClose?: () => void;
}

export const ViewPokemonPage: React.FC<IViewPokemonPage> = ({
  selectedPokemonAtClick,
  onClose,
}) => {
  return (
    <div className="w-full max-w-[500px] mx-auto">
      {selectedPokemonAtClick ? (
        <div className="w-full rounded-xl shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center">
          {/* Header - Name and Level */}
          <div className="flex justify-between w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
            <div className="capitalize font-bold text-xl flex items-center">
              {selectedPokemonAtClick.name}
              {selectedPokemonAtClick.nickname &&
                selectedPokemonAtClick.nickname !==
                  selectedPokemonAtClick.pokedex_number.toString() && (
                  <span className="text-sm font-light italic ml-1">
                    ({selectedPokemonAtClick.nickname})
                  </span>
                )}
            </div>
            <div className="font-bold text-xl">
              Lvl. {selectedPokemonAtClick.level}
            </div>
          </div>

          {/* Image with gradient background */}
          <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 p-4 flex justify-center items-center">
            <img
              src={selectedPokemonAtClick.img}
              alt={selectedPokemonAtClick.name}
              className="w-[60%] h-auto object-contain max-h-[180px]"
            />
          </div>

          {/* Health and Exp Bars Section */}
          <div className="w-full px-4 py-3">
            {/* Health bar */}
            <div className="mb-3">
              <div className="text-sm flex justify-between font-medium text-gray-700 mb-1">
                <span>Health:</span>
                <span>
                  {selectedPokemonAtClick.hp}/{selectedPokemonAtClick.maxHp}{' '}
                  test
                </span>
              </div>
              <div className="bg-gray-200 h-[12px] rounded-full shadow-inner">
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

            {/* Stats Grid */}
            <div className="flex justify-between mb-3">
              <div className="bg-gray-100 rounded p-2 text-center flex-1 mx-1">
                <div className="text-sm text-gray-500">ATK</div>
                <div className="font-bold">{selectedPokemonAtClick.attack}</div>
              </div>
              <div className="bg-gray-100 rounded p-2 text-center flex-1 mx-1">
                <div className="text-sm text-gray-500">DEF</div>
                <div className="font-bold">
                  {selectedPokemonAtClick.defense}
                </div>
              </div>
              <div className="bg-gray-100 rounded p-2 text-center flex-1 mx-1">
                <div className="text-sm text-gray-500">SPD</div>
                <div className="font-bold">{selectedPokemonAtClick.speed}</div>
              </div>
            </div>

            {/* Evolution Bonus Badge */}
            {selectedPokemonAtClick.hasEvolutionBonus && (
              <div className="bg-green-100 border border-green-500 text-green-700 px-3 py-2 rounded-lg text-sm font-medium mb-3 flex items-center">
                <span className="font-bold mr-1">★</span>
                {selectedPokemonAtClick.evolutionBonusText}
              </div>
            )}

            {/* Battle Statistics Card */}
            <div className="bg-white rounded-lg shadow-md p-3 mb-3">
              <div className="font-semibold text-lg border-b pb-1 mb-2 text-blue-800">
                Battle Statistics
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">
                  Battles fought:
                  <span className="font-bold ml-1">
                    {selectedPokemonAtClick.battlesFought}
                  </span>
                </div>

                <div className="text-sm">
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

                <div className="text-sm">
                  Wins:
                  <span className="font-bold text-green-600 ml-1">
                    {selectedPokemonAtClick.battlesWon}
                  </span>
                </div>

                <div className="text-sm">
                  Losses:
                  <span className="font-bold text-red-600 ml-1">
                    {selectedPokemonAtClick.battlesLost}
                  </span>
                </div>
              </div>
            </div>

            {/* Evolution Button */}
            <div className="my-3">
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
