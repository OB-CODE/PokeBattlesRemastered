import { Caprasimo } from "next/font/google";
import { useState } from "react";
import { IallBattleStateInfo } from "../../GameMainPage";
import BattleGroundsChosen from "./BattleGroundsChosen";
import BattleScreenChoice from "./BattleScreenChoice";
import userInBattleStoreFlag from "../../../store/userInBattleStoreFlag";
const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

export interface IbattleStateAndTypeInfo extends IallBattleStateInfo {
  battleTypeChosen: boolean;
  battleLocation: number;
}

const BattleScreen = (allBattleStateInfo: IallBattleStateInfo) => {
  const { playerPokemon } = allBattleStateInfo;

  const [battleTypeChosen, setBattleTypeChosen] = useState(false);
  const [battleLocation, setBattleLocation] = useState(0);

  const setUserIsInBattle = userInBattleStoreFlag(
    (state) => state.setUserIsInBattle
  );

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
          className={`${CaprasimoFont.className} text-2xl text-center w-full`}
        >
          Battle Screen
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
