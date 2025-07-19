import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import accountStatsStore from "../../../store/accountStatsStore";
import { battleLogStore } from "../../../store/battleLogStore";
import { battleService } from "../../services/battleService";
import { constructionToast } from "../../utils/helperfn";
import { returnMergedPokemon } from "../../utils/pokemonToBattleHelpers";
import { getBattleLocationDetails } from "../../utils/UI/Core/battleLocations";
import { locedSVG } from "../../utils/UI/svgs";

interface IBattleScreenChoice {
  setBattleTypeChosen: React.Dispatch<React.SetStateAction<boolean>>;
  setBattleLocation: React.Dispatch<React.SetStateAction<number>>;
}

const BattleScreenChoice = ({
  setBattleTypeChosen,
  setBattleLocation,
}: IBattleScreenChoice) => {
  const { user } = useAuth0();

  const clearMessageLog = battleLogStore((state) => state.resetMessageLog);

  const totalBattlesFromStore = accountStatsStore(
    (state) => state.totalBattles
  );
  const increaseTotalBattles = accountStatsStore(
    (state) => state.setTotalBattles
  );

  function proceedToBattleHandler(locationId: number) {
    // Increment the total battles count in the store and database
    battleService.incrementTotalBattles(user?.sub);
    // Handle locations.
    if (
      locationId == 1 ||
      locationId == 2 ||
      locationId == 3 ||
      locationId == 4 ||
      locationId == 5
    ) {
      setBattleLocation(locationId);
      clearMessageLog();
      setBattleTypeChosen(true);
    } else {
      constructionToast();
    }
  }

  // All details relating to location.
  const battleLocations = getBattleLocationDetails();
  let currentMergedPokemonData = returnMergedPokemon();

  return (
    <div className="flex flex-wrap h-full w-full overflow-y-auto justify-center">
      {battleLocations.map((location) => (
        <div
          key={location.name}
          className={`${location.accessible == true ? "bg-blue-100" : "bg-gray-400"} border-black shadow-lg border-2 flex flex-col items-center p-2 m-3  opacity-80 h-fit w-full max-w-[1000px]`}
        >
          <div
            className={`font-bold w-full text-center ${location.backgroundColour} py-1 text-lg`}
          >
            {location.name}
          </div>
          <div
            id="locationHeader"
            className="w-full flex justify-between px-4 py-2 bg-blue-50 mb-2 border-b border-blue-200"
          >
            <div className="moneyContainer gap-2 flex flex-row items-start basis-1/4">
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase font-bold text-gray-600">
                  Reward
                </span>
                <span className="font-bold text-green-600">
                  ${location.baseMoneyEarnt}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase font-bold text-gray-600">
                  Bonus
                </span>
                <span className="font-bold text-green-600">
                  ($1 to ${location.potentialBonus})
                </span>
              </div>
            </div>
            <div
              id="locationRequirements"
              className="flex-grow text-center flex flex-col justify-center basis-1/2"
            >
              <span className="capitalize font-bold">Requirements:</span>{" "}
              {location.requirements}
            </div>
            <div className="flex flex-col items-center basis-1/4">
              <span className="text-xs uppercase font-bold text-gray-600">
                Max Level
              </span>
              <span className="font-bold">
                {location.minLevelBonus != undefined
                  ? location.maxLevel + location.minLevelBonus
                  : location.maxLevel}
              </span>
            </div>
          </div>

          <div>{location.description}</div>
          <div>{location.img}</div>

          <div className="flex w-full justify-center py-2 flex-wrap">
            {currentMergedPokemonData.map((pokemon) => {
              if (
                location.pokemonInArea &&
                location.pokemonInArea.includes(pokemon.pokedex_number)
              ) {
                return (
                  <div
                    key={pokemon.pokedex_number}
                    className="flex w-12 h-12 capitalize justify-center items-center mx-1"
                  >
                    <div
                      className={`${pokemon.caught ? "bg-yellow-100 border-black" : "border-white"} w-12 h-12 border rounded-full`}
                    >
                      {pokemon.seen ? (
                        <img
                          title={pokemon.name.toUpperCase()}
                          src={pokemon.img}
                        ></img>
                      ) : (
                        <div className="w-12 h-12 flex justify-center items-center">
                          ?
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <button
            onClick={() => {
              proceedToBattleHandler(location.id);
            }}
            disabled={location.accessible ? false : true}
            className={`
              text-black 
              bg-yellow-300 
              hover:bg-yellow-400 
              w-fit py-1 px-3 
              border-2 border-black 
              rounded-xl
              disabled:bg-gray-300
              disabled:text-gray-500
              disabled:border-gray-400
              disabled:cursor-not-allowed
              disabled:hover:bg-gray-300
              disabled:opacity-70
            `}
          >
            Proceed to Battle
          </button>
          {location.accessible === false && (
            <div className="w-12 h-0">
              <div className="relative left-[5.5rem] bottom-6 animate-bounce hover:animate-pulse">
                {locedSVG}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BattleScreenChoice;
