import React, { useEffect, useRef, useState } from "react";
import { battleLogStore } from "../../../../store/battleLogStore";
import { IPokemonMergedProps } from "../../PokemonParty";
import { pokeData } from "../../../../store/pokemonDataStore";
import { capitalizeString } from "../../../utils/helperfn";

interface IBattleLog {
  playerPokemon: IPokemonMergedProps;
  opponentPokemon: pokeData;
}

const BattleLog = ({ playerPokemon, opponentPokemon }: IBattleLog) => {
  const battleStoreMessageLog = battleLogStore((state) => state.messageLog);
  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );
  const [liveBattleMessage, setLiveBattleMessage] = useState(
    battleStoreMessageLog
  );

  useEffect(() => {
    setLiveBattleMessage(battleStoreMessageLog);
  }, [battleStoreMessageLog]);

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

  let liftedShadow =
    "shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-black/60 transition-shadow duration-300";

  return (
    <div
      ref={chatRef}
      className={`h-full w-[90%] bg-gray-200 overflow-y-auto overflow-anchor ${liftedShadow}`}
    >
      {liveBattleMessage.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default BattleLog;
