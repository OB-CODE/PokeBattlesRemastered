import { Caprasimo } from 'next/font/google';
import { useState } from 'react';
import { IallBattleStateInfo } from '../../GameMainPage';
import BattleGroundsChosen from './BattleGroundsChosen';
import BattleScreenChoice from './BattleScreenChoice';
import userInBattleStoreFlag from '../../../store/userInBattleStoreFlag';
const CaprasimoFont = Caprasimo({ subsets: ['latin'], weight: ['400'] });

export interface IbattleStateAndTypeInfo extends IallBattleStateInfo {
  battleLocation: number;
}

const BattleScreen = (allBattleStateInfo: IallBattleStateInfo) => {
  const { battleTypeChosen, setBattleTypeChosen } = allBattleStateInfo;
  const [battleLocation, setBattleLocation] = useState(0);

  let battleStateAndTypeInfo = {
    ...allBattleStateInfo,
    battleLocation,
  };

  return (
    <div
      id="battle-screen"
      className="w-full h-full flex flex-col items-center justify-start"
    >
      <div className="w-full flex justify-between items-center px-5 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md z-10">
        <div className="h-fit"></div>
        <div
          className={`${CaprasimoFont.className} text-xl sm:text-2xl text-center w-full`}
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
      <div className="flex-1 w-full flex items-center justify-center min-h-0">
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
