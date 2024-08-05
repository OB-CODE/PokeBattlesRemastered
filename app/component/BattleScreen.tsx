import React from "react";

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
      backgroundColour: "bg-blue-200 dark:bg-blue-700",
      img: "",
    },
    {
      name: "Tournament",
      requirements: "Open to all trainers, if you can afford it.",
      description:
        "Take your party to vs a trainers' party with a change to win money.",
      backgroundColour: "bg-blue-200 dark:bg-blue-700",
      img: "",
    },
    {
      name: "Fire realm",
      requirements: "Must have caught one Fire Pokemon",
      description:
        "A land filled with only Fire type Pokemon - Type bonuses are doubled here. Beware, the Pokemon are stronger than their level indicates in this land.",
      backgroundColour: "bg-blue-200 dark:bg-blue-700",
      img: "",
    },

    {
      name: "Rare",
      requirements: "Must have caught one Fire Pokemon",
      description:
        "Only the strongest and rarest Pokemon wonder these lands. Don't expect them to be low level.",
      backgroundColour: "bg-blue-200 dark:bg-blue-700",
      img: "",
    },
  ];

  return (
    <div>
      <div className="w-full flex justify-center">
        BattleScreen{" "}
        <button onClick={() => setUserIsInBattle(false)}>Go BACK</button>
      </div>
      <div className="flex flex-wrap h-full w-full">
        {battleLocations.map((location) => (
          <div className="flex flex-col px-2 m-3 bg-gray-300 h-fit w-fit">
            <div>{location.name}</div>
            <div>{location.requirements}</div>
            <div>{location.description}</div>
            <div>{location.img}</div>
            <button>Proceed to Battle</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleScreen;
