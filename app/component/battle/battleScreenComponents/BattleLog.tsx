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
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [battleStoreMessageLog]); // The effect runs whenever `messages` changes

  useEffect(() => {
    if (!hasLogged.current && opponentPokemon?.name && playerPokemon?.name) {
      addToMessageLogInStore(
        `A wild ${capitalizeString(opponentPokemon.name)} appears and you send ${capitalizeString(playerPokemon.name)} to battle.`
      );
      hasLogged.current = true; // Set the ref to true after logging
    }
  }, []);

  return (
    <div
      ref={chatRef}
      className="h-full w-[90%] bg-gray-200 overflow-y-auto overflow-anchor"
    >
      {battleStoreMessageLog.map((message) => (
        <div>{message}</div>
      ))}
    </div>
  );
};

export default BattleLog;
