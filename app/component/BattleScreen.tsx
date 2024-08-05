import React from "react";

interface BattleScreenProps {
  userIsInBattle: boolean;
  setUserIsInBattle: React.Dispatch<React.SetStateAction<boolean>>;
}

const BattleScreen = ({
  userIsInBattle,
  setUserIsInBattle,
}: BattleScreenProps) => {
  let battleLocations = [
    {
      name: "Wilderness",
      requirements: "Open to all trainers.",
      description:
        "A place to encounter any pokemon at random. Usually lower levels.",
      img: "",
    },
    {
      name: "Tournament",
      requirements: "Open to all trainers.",
      description:
        "Take your party to vs a trainers' party with a change to win money.",
      img: "",
    },
    {
      name: "Fire realm",
      requirements: "Must have caught one Fire Pokemon",
      description:
        "A land filled with only Fire type Pokemon - Type bonuses are doubled here. Beware, the Pokemon are stronger than their level indicates in this land.",
      img: "",
    },

    {
      name: "Rare",
      requirements: "Must have caught one Fire Pokemon",
      description:
        "A land filled with only Fire type Pokemon - Type bonuses are doubled here. Beware, the Pokemon are stronger than their level indicates in this land.",
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
