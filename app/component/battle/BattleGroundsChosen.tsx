import React from "react";
import Wilderness from "./battleLocations/Wilderness";
import Tournament from "./Tournament";
import { IPokemonMergedProps } from "../PokemonParty";
import { IbattleStateAndTypeInfo } from "./BattleScreen";

const BattleGroundsChosen = (
  battleStateAndTypeInfo: IbattleStateAndTypeInfo
) => {
  const { battleLocation, playerPokemon } = battleStateAndTypeInfo;
  function returnComponentToLoad() {
    if (battleLocation == "Wilderness") {
      return <Wilderness {...battleStateAndTypeInfo} />; //
    } else {
      // return <Tournament />;
    }
  }

  return <div className="h-full w-full">{returnComponentToLoad()}</div>;
};

export default BattleGroundsChosen;
