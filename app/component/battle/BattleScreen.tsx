import { Caprasimo } from 'next/font/google';
import { useState } from 'react';
import { IallBattleStateInfo } from '../../GameMainPage';
import BattleGroundsChosen from './BattleGroundsChosen';
import BattleScreenChoice from './BattleScreenChoice';
import userInBattleStoreFlag from '../../../store/userInBattleStoreFlag';
import { useLastBattleAreaStore } from '../../../store/lastBattleAreaStore';
import { getBattleLocationDetails } from '../../utils/UI/Core/battleLocations';
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

  // Repeat Last Battle Area Button for bottom placement
  const lastArea = useLastBattleAreaStore((state) => state.lastArea);
  const battleLocations = getBattleLocationDetails();
  const lastAreaId = lastArea ? parseInt(lastArea) : null;
  const lastLocation = battleLocations.find((loc) => loc.id === lastAreaId);
  const handleRepeatBattle = () => {
    if (!lastLocation) return;
    setBattleLocation(lastLocation.id);
    setBattleTypeChosen(true);
  };

  return (
    <div
      id="battle-screen"
      className="w-full h-full flex flex-col items-center justify-start"
    >
      <div className="w-full flex justify-between items-center px-5 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md z-[5]">
        <div className="h-fit"></div>
        <div
          className={`${CaprasimoFont.className} text-xl sm:text-2xl text-center w-full`}
        >
          Battle Screen
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col items-center justify-center min-h-0">
        {battleTypeChosen ? (
          <BattleGroundsChosen {...battleStateAndTypeInfo} />
        ) : (
          <BattleScreenChoice
            setBattleTypeChosen={setBattleTypeChosen}
            setBattleLocation={setBattleLocation}
          />
        )}
      </div>
      {/* Repeat Last Battle Area Button - between orbs, just above the shell bar */}
      {!battleTypeChosen && (
        <div className="z-[5] w-full pt-2 flex justify-center pb-1">
          <button
            onClick={handleRepeatBattle}
            disabled={!lastLocation}
            className={`px-4 py-1 rounded-lg font-bold border-2 transition-colors duration-200 text-sm
              ${lastLocation ? 'bg-yellow-300 hover:bg-yellow-400 text-black border-yellow-600' : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-70'}`}
          >
            {lastLocation
              ? `Repeat Last Battle: ${lastLocation.name}`
              : 'Repeat Last Battle (none)'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
