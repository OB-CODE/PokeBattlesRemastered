import React, { useEffect, useRef } from "react";
import { battleLogStore } from "../../../../store/battleLogStore";
import { IPokemonMergedProps } from "../../PokemonParty";
import { pokeData } from "../../../../store/pokemonDataStore";

interface IBattleLog {
  playerPokemon: IPokemonMergedProps;
  opponentPokemon: pokeData;
}

function capitalizeString(string: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const BattleLog = ({ playerPokemon, opponentPokemon }: IBattleLog) => {
  const battleStoreMessageLog = battleLogStore((state) => state.messageLog);
  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );
  const hasLogged = useRef(false); // stop use Effect code running twice in DEV modes.

  useEffect(() => {
    if (!hasLogged.current && opponentPokemon?.name && playerPokemon?.name) {
      addToMessageLogInStore(
        `A wild ${capitalizeString(opponentPokemon.name)} appears and you send ${capitalizeString(playerPokemon.name)} to battle.`
      );
      hasLogged.current = true; // Set the ref to true after logging
    }
  }, []);

  return (
    <div className="h-full w-full">
      {battleStoreMessageLog.map((message) => (
        <span>{message}</span>
      ))}
    </div>
  );
};

export default BattleLog;
