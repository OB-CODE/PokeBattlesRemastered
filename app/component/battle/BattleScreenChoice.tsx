import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { battleLogStore } from "../../../store/battleLogStore";
import { useScoreSystem } from "../../../store/scoringSystem";
import { battleService } from "../../services/battleService";
import { returnMergedPokemon } from "../../utils/pokemonToBattleHelpers";
import { getBattleLocationDetails } from "../../utils/UI/Core/battleLocations";
import { locedSVG } from "../../utils/UI/svgs";
import { yellowButton } from "../../utils/UI/UIStrings";
import { useCollapsedLocationsStore } from '../../../store/expandedLocationsStore';

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

  const collapsedLocations = useCollapsedLocationsStore((state) => state.collapsedLocations);
  const toggleDropdown = useCollapsedLocationsStore((state) => state.toggleLocation);
  const resetCollapsedLocations = useCollapsedLocationsStore((state) => state.resetCollapsedLocations);

  function proceedToBattleHandler(locationId: number) {
    // Increment the total battles count in the store and database
    battleService.incrementTotalBattles(user?.sub);

    // Record battle start in scoring system (applies small penalty)
    onBattleStart();

    setBattleLocation(locationId);
    clearMessageLog();
    setBattleTypeChosen(true);
  }

  // All details relating to location.
  const battleLocations = getBattleLocationDetails();
  let currentMergedPokemonData = returnMergedPokemon();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full overflow-y-auto px-4 py-2">
      {battleLocations.map((location) => (
        <div
          key={location.name}
          className={`${location.accessible == true ? "bg-blue-200" : "bg-gray-400"} border-black shadow-lg border-2 flex flex-col items-center p-2 opacity-80 w-full`}
          style={{ height: !collapsedLocations[location.id] ? "600px" : "130px" }} // Fixed consistent height for all cards
        >
          {/* name of location and collapse button */}
<div
            className={`font-bold w-full text-center ${location.backgroundColour} py-2 text-lg rounded-t`}
          >
                      <div className="w-full flex justify-between">
                      <div className="w-10"></div>  <div>{location.name} </div> <div className="w-10">
                      <button onClick={() => toggleDropdown(location.id)} className="text-lg font-bold">
    {collapsedLocations[location.id] ? "▾" : "▴"}
    {/* Collapsed should point downwards and expanded should point upwards */}
  </button>
                      </div>
                      </div>
          </div>
          
          {!collapsedLocations[location.id] && (
            <div>
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
          ${location.baseMoneyEarnt} to $
          {location.baseMoneyEarnt + location.potentialBonus}
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
          <div className="flex h-full flex-col flex-grow w-full">
            <div className="px-2 py-2 text-center">{location.description}</div>
            {/* <div className="py-2 flex justify-center">{location.img}</div> */}

            {/* Pokemon list container with fixed height and scroll */}
            <div className="w-full flex-grow flex justify-center overflow-hidden">
              <div
                id="pokemonCircleHolder"
                className="flex w-full max-h-[250px] justify-center items-start py-3 pt-6 flex-wrap gap-2 overflow-y-auto overflow-x-hidden"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "gray transparent",
                }}
              >
                {currentMergedPokemonData.map((pokemon) => {
                  if (
                    location.pokemonInArea &&
                    location.pokemonInArea.includes(pokemon.pokedex_number)
                  ) {
                    return (
                      <div
                        key={pokemon.pokedex_number}
                        className="flex h-fit capitalize justify-center items-center group relative m-1"
                      >
                        <div
                          className={`${pokemon.caught ? "bg-yellow-100 border-black" : "border-white"} w-10 h-10 sm:w-16 sm:h-16 border rounded-full flex justify-center items-center hover:scale-110 transition-transform`}
                        >
                          {pokemon.seen ? (
                            <img
                              src={pokemon.img}
                              alt={pokemon.name}
                              className="w-full h-fit object-contain p-1"
                            ></img>
                          ) : (
                            <div className="w-full h-fit flex justify-center items-center text-lg font-bold">
                              ?
                            </div>
                          )}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                          {pokemon.seen ? (
                            <span className="capitalize">{pokemon.name}</span>
                          ) : (
                            <span>Unknown Pokémon</span>
                          )}
                          {pokemon.caught && <span className="ml-1">✓</span>}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div> 
          </div>
)}


          {/* Button container - fixed height at the bottom */}
          <div className="w-full flex justify-center mt-auto pt-4 pb-2 relative">
            <button
              onClick={() => {
                proceedToBattleHandler(location.id);
              }}
              disabled={location.accessible ? false : true}
              className={`
${yellowButton}
                disabled:bg-gray-300
                disabled:text-gray-500
                disabled:border-gray-400
                disabled:cursor-not-allowed
                disabled:hover:bg-gray-300
                disabled:opacity-70
                disabled:hover:none
              `}
            >
              Proceed to Battle
            </button>
            {location.accessible === false && (
              <div className="absolute top-2 animate-bounce hover:animate-pulse">
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
