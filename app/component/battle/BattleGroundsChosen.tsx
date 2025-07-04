import { useState } from "react";
import {
  generateFirePokemonToBattle,
  generatePokemonToBattleForFarm,
  generatePokemonToBattleForWilderness,
} from "../../utils/pokemonToBattleHelpers";
import MainBattleLocation from "./battleLocations/MainBattleLocation";
import { IbattleStateAndTypeInfo } from "./BattleScreen";

function generateOpponent(battleLocation: number) {
  if (battleLocation == 1) {
    return generatePokemonToBattleForFarm();
  } else if (battleLocation == 2) {
    return generatePokemonToBattleForWilderness();
  } else if (battleLocation == 3) {
    // Fire realm, return pokemon with a fire type
    return generateFirePokemonToBattle();
  }
  // default all pokemone
  return generatePokemonToBattleForWilderness();
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
