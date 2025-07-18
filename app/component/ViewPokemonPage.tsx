import React from "react";
import { IPokemonMergedProps } from "./PokemonParty";
import EvolvePokemonButton from "./smallUI/EvolvePokemonButton";

interface IViewPokemonPage {
  selectedPokemonAtClick: IPokemonMergedProps;
  onClose?: () => void;
}

export const ViewPokemonPage: React.FC<IViewPokemonPage> = ({
  selectedPokemonAtClick,
  onClose,
}) => {
  return (
    <div className="flex justify-center items-center bg-gray-300 w-full h-full py-2">
      {selectedPokemonAtClick ? (
        <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-gray-100">
          <div className="pb-3 capitalize font-bold text-xl">
            {selectedPokemonAtClick.name}
          </div>
          {selectedPokemonAtClick.nickname &&
            selectedPokemonAtClick.nickname !==
              selectedPokemonAtClick.pokedex_number.toString() && (
              <div className="flex justify-center w-full mb-2 italic">
                "{selectedPokemonAtClick.nickname}"
              </div>
            )}
          <div className="h-[100%] w-[90%] bg-white flex justify-center">
            <img src={selectedPokemonAtClick.img} alt="" />
          </div>

          {/* Level info */}
          <div className="w-full text-center font-semibold my-2">
            Level: {selectedPokemonAtClick.level}
          </div>

          <div className="w-[80%]">
            <div>
              HP:
              <span className="font-bold">
                {selectedPokemonAtClick.hp.toString()}
              </span>
              /
              <span className="font-bold">
                {selectedPokemonAtClick.maxHp.toString()}
              </span>
            </div>
            <div>
              Attack:
              <span className="font-bold">
                {selectedPokemonAtClick.attack.toString()}
              </span>
            </div>
            <div>
              Defence:
              <span className="font-bold">
                {selectedPokemonAtClick.defense.toString()}
              </span>
            </div>
            <div>
              Speed:
              <span className="font-bold">
                {selectedPokemonAtClick.speed.toString()}
              </span>
            </div>
            {selectedPokemonAtClick.hasEvolutionBonus && (
              <div className="text-green-600 font-semibold mt-2 border border-green-300 bg-green-50 p-1 rounded">
                {selectedPokemonAtClick.evolutionBonusText}
              </div>
            )}

            {/* Battle statistics */}
            <div className="mt-4 border-t pt-2">
              <div className="font-semibold">Battle Statistics:</div>
              <div>
                Battles fought:{" "}
                <span className="font-bold">
                  {selectedPokemonAtClick.battlesFought}
                </span>
              </div>
              <div>
                Wins:{" "}
                <span className="font-bold text-green-600">
                  {selectedPokemonAtClick.battlesWon}
                </span>
              </div>
              <div>
                Losses:{" "}
                <span className="font-bold text-red-600">
                  {selectedPokemonAtClick.battlesLost}
                </span>
              </div>
              {selectedPokemonAtClick.battlesFought > 0 && (
                <div>
                  Win rate:{" "}
                  <span className="font-bold">
                    {Math.round(
                      (selectedPokemonAtClick.battlesWon /
                        selectedPokemonAtClick.battlesFought) *
                        100
                    )}
                    %
                  </span>
                </div>
              )}
            </div>
            <div>
              Battles fought:{" "}
              <span className="font-bold">
                {selectedPokemonAtClick.battlesFought.toString()}
              </span>
            </div>
            <div>
              Battles won:{" "}
              <span className="font-bold">
                {selectedPokemonAtClick.battlesWon.toString()}
              </span>
            </div>
            <div>
              Battles lost:{" "}
              <span className="font-bold">
                {selectedPokemonAtClick.battlesLost.toString()}
              </span>
            </div>

            {/* Add evolution button */}
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
