import React, { useEffect, useState } from "react";
import { battleLogStore } from "../../../../store/battleLogStore";
import Pokemon from "../../../utils/pokemonToBattleHelpers";
import userPokemonDetailsStore from "../../../../store/userPokemonDetailsStore";
import { pokeData } from "../../../../store/pokemonDataStore";
import { IPokemonMergedProps } from "../../PokemonParty";
import { capitalizeString } from "../../../utils/helperfn";
import { checkLevelUp } from "../../../../store/relatedMappings/experienceMapping";
import { toast } from "react-toastify";

const BattleOverCard = ({
  winner,
  playerPokemon,
  opponentPokemon,
  pokemonClass,
  playerClass,
}: {
  winner: string;
  opponentPokemon: pokeData;
  playerPokemon: IPokemonMergedProps;
  pokemonClass: Pokemon;
  playerClass: Pokemon;
}) => {
  const battleStoreMessageLog = battleLogStore((state) => state.messageLog);
  let lastMessage = battleStoreMessageLog[battleStoreMessageLog.length - 1];

  const [inputWinnerMessage, setInputWinnerMessage] = useState<string>("");

  const [isLevelingUp, setIsLevelingUp] = useState(false);

  const updateExperienceViaUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  useEffect(() => {
    if (lastMessage.includes("won")) {
      setInputWinnerMessage(lastMessage);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (winner == "player") {
      const expGained = pokemonClass.maxHp; // Random exp between 50 and 150
      const currentExp = playerPokemon.experience || 0;

      updateExperienceViaUserPokemonData(playerPokemon.pokedex_number, {
        experience: expGained + currentExp,
      });
      let canLevelUp = checkLevelUp(
        playerPokemon.level,
        currentExp + expGained
      );

      console.log(canLevelUp);
      if (canLevelUp === true) {
        setIsLevelingUp(true);
        toast.success(
          `${capitalizeString(playerPokemon.name)} leveled up! Now at level ${playerPokemon.level + 1}.`
        );
        updateExperienceViaUserPokemonData(playerPokemon.pokedex_number, {
          level: playerPokemon.level + 1,
        });
      } else if (canLevelUp === "Max") {
        // Notify user that they have reached max level
        console.log("Max Level Reached");
      }
    }
  }, []);

  return (
    <div className="h-full w-fit flex items-center justify-center relative">
      {inputWinnerMessage != "" ? (
        <div
          className={`p-4 ${winner == "player" ? "bg-green-500" : "bg-orange-400"} border w-[400px] absolute top-[50%] left-[50%] whitespace-nowrap translate-x-[-50%] translate-y-[-50%] text-center`}
        >
          <div> The Battle Is Over</div>
          <div>{inputWinnerMessage}</div>
          <div className="pt-3">
            {winner == "player"
              ? `You defeated ${capitalizeString(opponentPokemon.name)} and gained ${pokemonClass.maxHp} experience!`
              : `You lost to ${capitalizeString(opponentPokemon.name)}. Better luck next time!`}
          </div>
          <div>
            {isLevelingUp &&
              `${capitalizeString(playerPokemon.name)} leveled up! Now at level ${playerPokemon.level + 1}.`}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BattleOverCard;
