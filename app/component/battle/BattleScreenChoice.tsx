import React from "react";
import { constructionToast } from "../../utils/helperfn";
import BattleLog from "./battleScreenComponents/BattleLog";
import { battleLogStore } from "../../../store/battleLogStore";

interface IBattleScreenChoice {
  setBattleTypeChosen: React.Dispatch<React.SetStateAction<boolean>>;
  setBattleLocation: React.Dispatch<React.SetStateAction<string>>;
}

interface IBattleLocations {
  name: string;
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
  const clearMessageLog = battleLogStore((state) => state.resetMessageLog);
  let battleLocations: IBattleLocations[] = [
    {
      name: "Wilderness",
      requirements: "Open to all trainers.",
      description:
        "A place to encounter any pokemon at random. Usually lower levels. Local's will pay a small amount of Money for helping battle these Pokemon to move them away from the town.",
      backgroundColour: "bg-green-200 dark:bg-green-300",
      img: "",
      accessible: true,
    },
    {
      name: "Tournament",
      requirements: "Open to all trainers, if you can afford it.",
      description:
        "Take your party to vs a trainers' party with a change to win money.",
      backgroundColour: "bg-slate-400 dark:bg-slate-400",
      img: "",
      accessible: true,
    },
    {
      name: "Fire realm",
      requirements: "Must have a level 5 Fire Pokemon",
      description:
        "A land filled with only Fire type Pokemon - Type bonuses are doubled here. Beware, the Pokemon are stronger than their level indicates in this land.",
      backgroundColour: "bg-red-400 dark:bg-red-400",
      img: "",
      accessible: false,
    },
    {
      name: "Rare",
      requirements: "Must have a level 10 Pokemon",
      description:
        "Only the strongest and rarest Pokemon wonder these lands. Don't expect them to be low level.",
      backgroundColour: "bg-yellow-400 dark:bg-yellow-400",
      img: "",
      accessible: false,
    },
  ];

  function proceedToBattleHandler(locationName: string) {
    if (locationName == "Wilderness") {
      setBattleLocation(locationName);
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
          className={`${location.accessible == true ? "bg-blue-100" : "bg-gray-400"} border-black shadow-lg border-2 flex flex-col items-center p-2 m-3  opacity-80 h-fit w-full max-w-[1000px]`}>
          <div id="nameBanner" className="flex justify-between w-full">
            <div className={`flex ${location.backgroundColour}`}>
              {location.accessible === false ? (
                <div className="w-12">locked</div>
              ) : (
                <div className="w-12"></div>
              )}
            </div>
            <div
              className={`font-bold w-full text-center ${location.backgroundColour}`}>
              {location.name}
            </div>
            <div className={`flex ${location.backgroundColour}`}>
              {location.accessible === true ? (
                <div className="w-12">open</div>
              ) : (
                <div className="w-12"></div>
              )}
            </div>
          </div>

          <div>
            <span className="capitalize font-bold">Requirements:</span>{" "}
            {location.requirements}
          </div>
          <div>{location.description}</div>
          <div>{location.img}</div>
          <button
            onClick={() => {
              proceedToBattleHandler(location.name);
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
            `}>
            Proceed to Battle
          </button>
        </div>
      ))}
    </div>
  );
};

export default BattleScreenChoice;
