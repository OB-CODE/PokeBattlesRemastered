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
    // Use a small delay to ensure the content has fully rendered
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 0); // A delay of 0 ensures the effect runs after rendering
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
      className={`h-full flex flex-col justify-center max-w-[95%] bg-white rounded-lg shadow-md overflow-y-auto overflow-anchor pl-3 sm:p-3`}
    >
      <div className="text-sm font-semibold sm:mb-2 text-gray-700 border-b pb-1 border-gray-200">
        Battle Log:
      </div>
      <div className="text-sm flex max-w-[95%] flex-col space-y-1">
        {liveBattleMessage.map((message, index) => (
          <div
            key={index}
            className="py-1 border-b border-gray-100 last:border-0 w-full flex"
          >
            <div>
              {message}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;
