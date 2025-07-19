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
    <div
      id="battle-screen"
      className="max-h-[calc(100vh-180px)] h-full w-full flex flex-col overflow-hidden"
    >
      <div className="w-full flex justify-between items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
        <div className="w-20 h-fit"></div>
        <div
          className={`${CaprasimoFont.className} text-2xl text-center w-full`}
        >
          Battle Screen
        </div>
        {/* <div id="buttonHolderBack" className="flex">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded-lg shadow transition-colors duration-200 border border-yellow-600"
            onClick={() => setUserIsInBattle(false)}
          >
            Back
          </button>
        </div> */}
      </div>
      <div className="flex-grow overflow-auto">
        {battleTypeChosen ? (
          <BattleGroundsChosen {...battleStateAndTypeInfo} />
        ) : (
          <BattleScreenChoice
            setBattleTypeChosen={setBattleTypeChosen}
            setBattleLocation={setBattleLocation}
          />
        )}
      </div>
    </div>
  );
};

export default BattleScreen;
