import { useState } from "react";
import { pokeData } from "../../../store/pokemonDataStore";
import { generatePokemonToBattle } from "../../utils/pokemonToBattleHelpers";
import MainBattleLocation from "./battleLocations/MainBattleLocation";
import { IbattleStateAndTypeInfo } from "./BattleScreen";

function generateOpponent(battleLocation: number): pokeData {
  if (battleLocation == 1) {
    return generatePokemonToBattle();
  } else if (battleLocation == 2) {
    return generatePokemonToBattle();
  }

  // default all pokemone
  return generatePokemonToBattle();
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
