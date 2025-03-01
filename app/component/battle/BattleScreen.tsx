import { Caprasimo } from "next/font/google";
import React, { useState } from "react";
import BattleScreenChoice from "./BattleScreenChoice";
import BattleGroundsChosen from "./BattleGroundsChosen";
import { IallBattleStateInfo } from "../../GameMainPage";
const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

// interface IBattleScreen {
//   userIsInBattle: boolean;
//   setUserIsInBattle: React.Dispatch<React.SetStateAction<boolean>>;
//   playerPokemon: IPokemonMergedProps;
// }

export interface IbattleStateAndTypeInfo extends IallBattleStateInfo {
  battleTypeChosen: boolean;
  battleLocation: string;
}

const BattleScreen = (allBattleStateInfo: IallBattleStateInfo) => {
  const { userIsInBattle, setUserIsInBattle, playerPokemon } =
    allBattleStateInfo;

  const [battleTypeChosen, setBattleTypeChosen] = useState(false);
  const [battleLocation, setBattleLocation] = useState("");

  let battleStateAndTypeInfo = {
    ...allBattleStateInfo,
    battleTypeChosen,
    battleLocation,
  };

  return (
    <div className="h-[85%] w-full">
      <div className="w-full flex justify-between px-5 py-2">
        <div className="w-20 h-fit"></div>
        <div
          className={`${CaprasimoFont.className} text-2xl text-center w-full`}>
          Battle Screen
        </div>
        <div id="buttonHolderBack" className="flex">
          <button
            className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            onClick={() => setUserIsInBattle(false)}>
            Back
          </button>
        </div>
      </div>
      {battleTypeChosen ? (
        <BattleGroundsChosen
          {...battleStateAndTypeInfo}
          // playerPokemon={playerPokemon}
        />
      ) : (
        <BattleScreenChoice
          setBattleTypeChosen={setBattleTypeChosen}
          setBattleLocation={setBattleLocation}
        />
      )}
    </div>
  );
};

export default BattleScreen;
