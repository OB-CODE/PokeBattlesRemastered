import React, { useEffect, useRef, useState } from "react";
import { battleLogStore } from "../../../../store/battleLogStore";
import Pokemon from "../../../utils/pokemonToBattleHelpers";
import userPokemonDetailsStore from "../../../../store/userPokemonDetailsStore";
import { pokeData } from "../../../../store/pokemonDataStore";
import { IPokemonMergedProps } from "../../PokemonParty";
import {
  capitalizeString,
  increaseMoneyAfterBattle,
} from "../../../utils/helperfn";
import { checkLevelUp } from "../../../../store/relatedMappings/experienceMapping";
import { toast } from "react-toastify";
import accountStatsStore from "../../../../store/accountStatsStore";
import userInBattleStoreFlag from "../../../../store/userInBattleStoreFlag";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../../../utils/apiCallsNext";
import { battleService } from "../../../services/battleService";

const BattleOverCard = ({
  winner,
  playerPokemon,
  opponentPokemon,
  pokemonClass,
  playerClass,
  battleLocation,
}: {
  winner: string;
  opponentPokemon: pokeData;
  playerPokemon: IPokemonMergedProps;
  pokemonClass: Pokemon;
  playerClass: Pokemon;
  battleLocation: number;
}) => {
  const battleStoreMessageLog = battleLogStore((state) => state.messageLog);
  const { user } = useAuth0();
  let lastMessage = battleStoreMessageLog[battleStoreMessageLog.length - 1];

  const [inputWinnerMessage, setInputWinnerMessage] = useState<string>("");

  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [moneyGained, setMoneyGained] = useState(0);

  // Adjust Player Stats via store
  const playerHasWonStore = accountStatsStore((state) => state.totalBattlesWon);
  const playerHasLostStore = accountStatsStore(
    (state) => state.totalBattlesLost
  );

  const updateExperienceViaUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  const setUserIsInBattle = userInBattleStoreFlag(
    (state) => state.setUserIsInBattle
  );

  // Adjust the pokemons data via store.
  const playerPokemonData = userPokemonDetailsStore(
    (state) => state.userPokemonData
  ).find((pokemon) => pokemon.pokedex_number === playerPokemon.pokedex_number);

  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );
  let battlesFought = (playerPokemonData?.battlesFought || 0) + 1;
  let battlesWon =
    winner === "player"
      ? (playerPokemonData?.battlesWon || 0) + 1
      : playerPokemonData?.battlesWon;
  let battlesLost =
    winner === "player"
      ? playerPokemonData?.battlesLost
      : (playerPokemonData?.battlesLost || 0) + 1;
  let experience = playerPokemonData?.experience || 0;

  useEffect(() => {
    if (lastMessage.includes("won")) {
      setInputWinnerMessage(lastMessage);
    }
  }, [lastMessage]);

  //TODO: Use a ref to ensure this effect runs only once when the component mounts.
  const hasRun = useRef(false);

  useEffect(() => {
    // This effect runs only once when the component mounts - No need for it to run twice in DEV mode.
    if (hasRun.current) return;
    hasRun.current = true;

    if (winner == "player") {
      // Update account stats
      battleService.incrementBattlesWon(user?.sub);

      const expGained = pokemonClass.maxHp; // Random exp between 50 and 150
      const currentExp = playerPokemon.experience || 0;

      let canLevelUp = checkLevelUp(
        playerPokemon.level,
        currentExp + expGained
      );

      if (canLevelUp === true) {
        setIsLevelingUp(true);
        toast.success(
          `${capitalizeString(playerPokemon.name)} leveled up! Now at level ${playerPokemon.level + 1}.`
        );
      } else if (canLevelUp === "Max") {
        // Notify user that they have reached max level
        console.log("Max Level Reached");
      }

      let moneyIncreasedBy = increaseMoneyAfterBattle(battleLocation);
      setMoneyGained(moneyIncreasedBy);
      // Update user pokemon data
      // Adjust the pokemons data via store.
      if (user && user.sub) {
        api.updatePokemon(playerPokemon.pokedex_number, user.sub, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesWon: battlesWon,
          battlesLost: battlesLost,
          experience: expGained + currentExp,
          level: (canLevelUp && playerPokemon.level + 1) || playerPokemon.level,
        });
      } else {
        updateUserPokemonData(playerPokemon.pokedex_number, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesWon: battlesWon,
          battlesLost: battlesLost,
          experience: expGained + currentExp,
          level: (canLevelUp && playerPokemon.level + 1) || playerPokemon.level,
        });
      }
    } else {
      // Update account stats
      battleService.incrementBattlesLost(user?.sub);
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
            {winner == "player" ? (
              <div>
                <div>
                  You defeated {capitalizeString(opponentPokemon.name)} and
                  gained {pokemonClass.maxHp} experience!
                </div>
                <div className="pt-3">
                  Money earnt from battle: ${moneyGained}
                </div>
              </div>
            ) : (
              `You lost to ${capitalizeString(opponentPokemon.name)}. Better luck next time!`
            )}
          </div>
          <div>
            {isLevelingUp &&
              `${capitalizeString(playerPokemon.name)} leveled up! Now at level ${playerPokemon.level + 1}.`}
          </div>
          <div className="pt-2">
            <button
              className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              onClick={() => setUserIsInBattle(false)}
            >
              End Battle
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BattleOverCard;
