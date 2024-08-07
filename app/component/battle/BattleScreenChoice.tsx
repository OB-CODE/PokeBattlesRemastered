import React from "react";
import { constructionToast } from "../../utils/helperfn";

interface IBattleLocations {
  name: string;
  requirements: string;
  description: string;
  backgroundColour: string;
  img: string;
}

const BattleScreenChoice = ({ setBattleTypeChosen, setBattleLocation }) => {
  let battleLocations: IBattleLocations[] = [
    {
      name: "Wilderness",
      requirements: "Open to all trainers.",
      description:
        "A place to encounter any pokemon at random. Usually lower levels. Local's will pay a small amount of Money for helping battle these Pokemon to move them away from the town.",
      backgroundColour: "bg-green-200 dark:bg-green-300",
      img: "",
    },
    {
      name: "Tournament",
      requirements: "Open to all trainers, if you can afford it.",
      description:
        "Take your party to vs a trainers' party with a change to win money.",
      backgroundColour: "bg-slate-400 dark:bg-slate-400",
      img: "",
    },
    {
      name: "Fire realm",
      requirements: "Must have caught one Fire Pokemon",
      description:
        "A land filled with only Fire type Pokemon - Type bonuses are doubled here. Beware, the Pokemon are stronger than their level indicates in this land.",
      backgroundColour: "bg-red-400 dark:bg-red-400",
      img: "",
    },

    {
      name: "Rare",
      requirements: "Must have caught one Fire Pokemon",
      description:
        "Only the strongest and rarest Pokemon wonder these lands. Don't expect them to be low level.",
      backgroundColour: "bg-yellow-400 dark:bg-yellow-400",
      img: "",
    },
  ];

  function proceedToBattleHandler(locationName: string) {
    if (locationName == "Wilderness") {
      setBattleLocation(locationName);
      setBattleTypeChosen(true);
    } else {
      constructionToast();
    }
  }

  return (
    <div className="flex flex-wrap h-full w-full  overflow-y-auto ">
      {battleLocations.map((location) => (
        <div className="border-black shadow-lg border-2 flex flex-col items-center p-2 m-3 bg-gray-200 opacity-80	 h-fit w-full">
          <div
            className={`font-bold w-full text-center ${location.backgroundColour}`}
          >
            {location.name}
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
            className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
          >
            Proceed to Battle
          </button>
        </div>
      ))}
    </div>
  );
};

export default BattleScreenChoice;
