import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import accountStatsStore from "../../../store/accountStatsStore";
import { battleLogStore } from "../../../store/battleLogStore";
import { useScoreSystem } from "../../../store/scoringSystem";
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
  const { onBattleStart } = useScoreSystem();

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

    // Record battle start in scoring system (applies small penalty)
    onBattleStart();

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full overflow-y-auto px-4 py-2">
      {battleLocations.map((location) => (
        <div
          key={location.name}
          className={`${location.accessible == true ? "bg-blue-100" : "bg-gray-400"} border-black shadow-lg border-2 flex flex-col items-center p-2 opacity-80 w-full`}
          style={{ height: "600px" }} // Fixed consistent height for all cards
        >
          <div
            className={`font-bold w-full text-center ${location.backgroundColour} py-2 text-lg rounded-t`}
          >
            {location.name}
          </div>
          <div
            id="locationHeader"
            className="w-full flex flex-col sm:flex-row justify-between px-4 py-3 bg-blue-50 mb-2 border-b border-blue-200"
          >
            <div className="moneyContainer flex flex-row justify-center sm:justify-start items-center gap-4 sm:basis-1/3 py-1">
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
              className="flex-grow text-center flex flex-col justify-center sm:basis-1/3 py-1 px-2"
            >
              <span className="capitalize font-bold">Requirements:</span>{" "}
              {location.requirements}
            </div>
            <div className="flex flex-col items-center sm:basis-1/3 py-1">
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

          {/* Main content area - flex-grow to fill available space */}
          <div className="flex h-full flex-col flex-grow w-full  overflow-auto">
            <div className="px-2 py-2 text-center">{location.description}</div>
            <div className="py-2 flex justify-center">{location.img}</div>

            {/* Pokemon list - allow this to grow or shrink as needed */}
            <div className="flex w-full h-full justify-center py-3 flex-wrap gap-1 px-2 flex-grow  overflow-auto">
              {currentMergedPokemonData.map((pokemon) => {
                if (
                  location.pokemonInArea &&
                  location.pokemonInArea.includes(pokemon.pokedex_number)
                ) {
                  return (
                    <div
                      key={pokemon.pokedex_number}
                      className="flex capitalize justify-center items-center"
                    >
                      <div
                        className={`${pokemon.caught ? "bg-yellow-100 border-black" : "border-white"} w-10 h-10 sm:w-16 sm:h-16 border rounded-full flex justify-center items-center hover:scale-110 transition-transform`}
                      >
                        {pokemon.seen ? (
                          <img
                            title={pokemon.name.toUpperCase()}
                            src={pokemon.img}
                            alt={pokemon.name}
                            className="w-full h-full object-contain p-1"
                          ></img>
                        ) : (
                          <div className="w-full h-full flex justify-center items-center text-lg font-bold">
                            ?
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          {/* Button container - fixed height at the bottom */}
          <div className="w-full flex justify-center mt-auto pt-4 pb-2 relative">
            <button
              onClick={() => {
                proceedToBattleHandler(location.id);
              }}
              disabled={location.accessible ? false : true}
              className={`
                text-black 
                bg-yellow-300 
                hover:bg-yellow-400 
                py-2 px-6
                border-2 border-black 
                rounded-xl
                font-bold
                transition-colors
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
              <div className="absolute -top-2 right-1/4 md:right-1/3 animate-bounce hover:animate-pulse">
                {locedSVG}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BattleScreenChoice;
