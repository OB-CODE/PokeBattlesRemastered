import { useState } from "react";
import { generatePokemonFromLocation } from "../../utils/pokemonToBattleHelpers";
import { getBattleLocationDetails } from "../../utils/UI/Core/battleLocations";
import MainBattleLocation from "./battleLocations/MainBattleLocation";
import { IbattleStateAndTypeInfo } from "./BattleScreen";

function generateOpponent(battleLocation: number) {
  const allBattleLocations = getBattleLocationDetails();
  const locationDetails = allBattleLocations.find(
    (location) => location.id === battleLocation
  );

  return generatePokemonFromLocation(
    locationDetails?.pokemonInArea || [],
    locationDetails.maxLevel,
    locationDetails.minLevelBonus || 0
  );
}

const BattleGroundsChosen = (
  battleStateAndTypeInfo: IbattleStateAndTypeInfo
) => {
  const { battleLocation } = battleStateAndTypeInfo;
  const [opponentPokemon] = useState(generateOpponent(battleLocation));
  let battleStateAndTypeInfoWithOpponent = {
    ...battleStateAndTypeInfo,
    opponentPokemon,
  };

  return (
    <div className="h-full w-full">
      <MainBattleLocation {...battleStateAndTypeInfoWithOpponent} />
    </div>
  );
};
export default BattleGroundsChosen;
