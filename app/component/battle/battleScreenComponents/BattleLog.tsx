import React, { useEffect, useRef, useState } from 'react';
import { battleLogStore } from '../../../../store/battleLogStore';
import { IPokemonMergedProps } from '../../PokemonParty';
import { pokeData } from '../../../../store/pokemonDataStore';
import { capitalizeString } from '../../../utils/helperfn';

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
    'shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-black/60 transition-shadow duration-300';

  return (
    <div
      ref={chatRef}
      className={`h-full flex flex-col max-w-full bg-gray-50 rounded-md shadow-sm overflow-y-auto overflow-anchor px-2 py-1`}
    >
      <div className="text-xs font-semibold text-gray-600 border-b pb-0.5 border-gray-200 mb-0.5">
        Battle Log:
      </div>
      <div className="text-xs sm:text-sm flex flex-col space-y-0.5">
        {liveBattleMessage.map((message, index) => (
          <div
            key={index}
            className="py-0.5 border-b border-gray-100 last:border-0 text-gray-700"
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;
