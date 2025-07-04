import React from "react";
import { constructionToast } from "../../utils/helperfn";
import BattleLog from "./battleScreenComponents/BattleLog";
import { battleLogStore } from "../../../store/battleLogStore";
import { locedSVG } from "../../utils/UI/svgs";
import accountStatsStore from "../../../store/accountStatsStore";
import { api } from "../../utils/apiCallsNext";
import { useAuth0 } from "@auth0/auth0-react";
import { battleService } from "../../services/battleService";
import { pokemonDataStore } from "../../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../../store/userPokemonDetailsStore";
import { returnMergedPokemon } from "../../utils/pokemonToBattleHelpers";

interface IBattleScreenChoice {
  setBattleTypeChosen: React.Dispatch<React.SetStateAction<boolean>>;
  setBattleLocation: React.Dispatch<React.SetStateAction<number>>;
}

interface IBattleLocations {
  name: string;
  id: number;
  requirements: string;
  description: string;
  backgroundColour: string;
  img: string;
  accessible: boolean;
}

const BattleScreenChoice = ({
  setBattleTypeChosen,
  setBattleLocation,
}: IBattleScreenChoice) => {
  const { user } = useAuth0();

  const clearMessageLog = battleLogStore((state) => state.resetMessageLog);

  const battlesWonByPlayer = accountStatsStore(
    (state) => state.totalBattlesWon
  );

  let currentMergedPokemonData = returnMergedPokemon();

  let doesPlayerHaveFirePokemonOverLv5 = currentMergedPokemonData.some(
    (pokemon) => pokemon.types.includes("fire") && pokemon.level >= 5
  );

  let battleLocations: IBattleLocations[] = [
    {
      name: "Town Farmlands",
      id: 1,
      requirements: "Open to all trainers.",
      description:
        "A place to encounter weak basic Pokemon. Always lower levels. Local's will pay a small amount of money for helping battle these Pokemon to move them away from the town.",
      backgroundColour: "bg-green-200 dark:bg-green-300",
      img: "",
      accessible: true,
    },
    {
      name: "Wilderness",
      id: 2,
      requirements: "For trainers who have won 5 battles.",
      description:
        "A place to encounter any pokemon at random. Usually lower levels. Local's will pay more for helping battle these Pokemon.",
      backgroundColour: "bg-green-200 dark:bg-green-300",
      img: "",
      accessible: battlesWonByPlayer >= 5 ? true : false,
    },
    {
      name: "Fire realm",
      id: 3,

      requirements: "Must have a level 5 Fire Pokemon",
      description:
        "A land filled with only Fire type Pokemon - Beware, the Pokemon are strong in this land.",
      backgroundColour: "bg-red-400 dark:bg-red-400",
      img: "",
      accessible: doesPlayerHaveFirePokemonOverLv5 ? true : false,
    },
    {
      name: "Tournament",
      id: 9,

      requirements:
        "Open trainers with a level 10 Pokemon, if you can afford it.",
      description:
        "Take your party to vs a trainers' party with a change to win money.",
      backgroundColour: "bg-slate-400 dark:bg-slate-400",
      img: "",
      accessible: false,
    },
    {
      name: "Rare",
      id: 10,

      requirements: "Must have a level 10 Pokemon",
      description:
        "Only the strongest and rarest Pokemon wonder these lands. Don't expect them to be low level.",
      backgroundColour: "bg-yellow-400 dark:bg-yellow-400",
      img: "",
      accessible: false,
    },
  ];

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
    if (locationId == 1 || locationId == 2 || locationId == 3) {
      setBattleLocation(locationId);
      clearMessageLog();
      setBattleTypeChosen(true);
    } else {
      constructionToast();
    }
  }

  return (
    <div className="flex flex-wrap h-full w-full overflow-y-auto justify-center">
      {battleLocations.map((location) => (
        <div
          key={location.name}
          className={`${location.accessible == true ? "bg-blue-100" : "bg-gray-400"} border-black shadow-lg border-2 flex flex-col items-center p-2 m-3  opacity-80 h-fit w-full max-w-[1000px]`}
        >
          <div
            className={`font-bold w-full text-center ${location.backgroundColour}`}
          >
            {location.name}
          </div>
          <div className={`flex ${location.backgroundColour}`}></div>

          <div>
            <span className="capitalize font-bold">Requirements:</span>{" "}
            {location.requirements}
          </div>
          <div>{location.description}</div>
          <div>{location.img}</div>
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
