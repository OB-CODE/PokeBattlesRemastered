import React from "react";
import Wilderness from "./battleLocations/Wilderness";
import Tournament from "./Tournament";
import { IPokemonForBattle } from "../PokemonParty";

interface IBattleGroundsChosen {
  battleLocation: string;
  playerPokemon: IPokemonForBattle | undefined;
}

const BattleGroundsChosen = ({
  battleLocation,
  playerPokemon,
}: IBattleGroundsChosen) => {
  function returnComponentToLoad() {
    if (battleLocation == "Wilderness") {
      return <Wilderness playerPokemon={playerPokemon} />; //
    } else {
      // return <Tournament />;
    }
  }

  return <div className="h-full w-full">{returnComponentToLoad()}</div>;
};

export default BattleGroundsChosen;
