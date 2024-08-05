import { Caprasimo } from "next/font/google";
import React from "react";
const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

interface BattleScreenProps {
  userIsInBattle: boolean;
  setUserIsInBattle: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IBattleLocations {
  name: string;
  requirements: string;
  description: string;
  backgroundColour: string;
  img: string;
}

const BattleScreen = ({
  userIsInBattle,
  setUserIsInBattle,
}: BattleScreenProps) => {
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

  return (
    <div className="h-[85%]">
      <div className="w-full flex justify-between px-5 py-2">
        <div className="w-20 h-fit"></div>
        <div
          className={`${CaprasimoFont.className} text-2xl text-center w-full`}
        >
          BattleScreen
        </div>
        <div id="buttonHolderBack" className="flex">
          <button
            className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            onClick={() => setUserIsInBattle(false)}
          >
            Back
          </button>
        </div>
      </div>
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
            <button className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl">
              Proceed to Battle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleScreen;
