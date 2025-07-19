import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import accountStatsStore from "../../../../store/accountStatsStore";
import { battleLogStore } from "../../../../store/battleLogStore";
import { pokeData } from "../../../../store/pokemonDataStore";
import { checkLevelUp } from "../../../../store/relatedMappings/experienceMapping";
import userInBattleStoreFlag from "../../../../store/userInBattleStoreFlag";
import userPokemonDetailsStore from "../../../../store/userPokemonDetailsStore";
import { battleService } from "../../../services/battleService";
import { api } from "../../../utils/apiCallsNext";
import {
  capitalizeString,
  increaseMoneyAfterBattle,
} from "../../../utils/helperfn";
import Pokemon from "../../../utils/pokemonToBattleHelpers";
import { IPokemonMergedProps } from "../../PokemonParty";

const BattleOverCard = ({
  winner,
  playerPokemon,
  opponentPokemon,
  opponentClass,
  playerClass,
  battleLocation,
}: {
  winner: string;
  opponentPokemon: pokeData;
  playerPokemon: IPokemonMergedProps;
  opponentClass: Pokemon;
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
    // Handle battle outcome messages
    if (lastMessage.includes("won")) {
      setInputWinnerMessage(lastMessage);
    } else if (lastMessage.includes("fled")) {
      setInputWinnerMessage(lastMessage);
    }
  }, [lastMessage]);

  //TODO: Use a ref to ensure this effect runs only once when the component mounts.
  const hasRun = useRef(false);

  const [expGained, setExpGained] = useState(0);

  useEffect(() => {
    // This effect runs only once when the component mounts - No need for it to run twice in DEV mode.
    if (hasRun.current) return;
    hasRun.current = true;

    if (winner == "player") {
      // Update account stats
      battleService.incrementBattlesWon(user?.sub);

      let opponentLevel = opponentPokemon.opponentLevel;

      let expGained = Math.round(
        opponentPokemon.maxHp * 2.5 * Number(`1.${opponentLevel || 1 * 2}`)
      );
      // give a bonus for each level above 1 the opponent
      if (opponentLevel && opponentLevel > 1) {
        expGained += Math.round(expGained * (opponentLevel * 0.3));
      }

      // give a bonus for each level the opponent is above the player
      if (opponentLevel && playerPokemon.level < opponentLevel) {
        const levelDifference = opponentLevel - playerPokemon.level;
        expGained += Math.round(expGained * (levelDifference * 0.6));
      }
      setExpGained(expGained);
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

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          api.updatePokemon(playerPokemonData.evolvedTo, user.sub, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      } else {
        updateUserPokemonData(playerPokemon.pokedex_number, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesWon: battlesWon,
          battlesLost: battlesLost,
          experience: expGained + currentExp,
          level: (canLevelUp && playerPokemon.level + 1) || playerPokemon.level,
        });

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          updateUserPokemonData(playerPokemonData.evolvedTo, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      }
    } else {
      // Update account stats
      battleService.incrementBattlesLost(user?.sub);
      if (user && user.sub) {
        api.updatePokemon(playerPokemon.pokedex_number, user.sub, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesLost: battlesLost,
        });

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          api.updatePokemon(playerPokemonData.evolvedTo, user.sub, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      } else {
        updateUserPokemonData(playerPokemon.pokedex_number, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesLost: battlesLost,
        });

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          updateUserPokemonData(playerPokemonData.evolvedTo, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      }
    }
  }, []);

  return (
    <div className="h-full w-fit flex items-center justify-center relative">
      {inputWinnerMessage != "" ? (
        <div className="w-[450px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden">
          <div
            className={`text-white py-3 px-4 text-center ${
              winner === "player"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : winner === "run"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : "bg-gradient-to-r from-orange-400 to-orange-500"
            }`}
          >
            <h2 className="text-xl font-bold">The Battle Is Over</h2>
          </div>

          <div className="p-4 text-center">
            <div className="text-lg font-semibold mb-3">
              {inputWinnerMessage}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              {winner === "player" ? (
                <div>
                  <div className="text-gray-800">
                    You defeated{" "}
                    <span className="font-semibold">
                      {capitalizeString(opponentPokemon.name)}
                    </span>{" "}
                    and gained{" "}
                    <span className="font-semibold text-green-600">
                      {expGained}
                    </span>{" "}
                    experience!
                  </div>
                  <div className="mt-3 text-gray-800">
                    Money earned:{" "}
                    <span className="font-semibold text-yellow-600">
                      ${moneyGained}
                    </span>
                  </div>
                </div>
              ) : winner === "run" ? (
                <div className="text-gray-800">
                  You ran away from the battle with{" "}
                  <span className="font-semibold">
                    {capitalizeString(opponentPokemon.name)}
                  </span>
                  .
                </div>
              ) : (
                <div className="text-gray-800">
                  You lost to{" "}
                  <span className="font-semibold">
                    {capitalizeString(opponentPokemon.name)}
                  </span>
                  . Better luck next time!
                </div>
              )}
            </div>

            {isLevelingUp && (
              <div className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-200 mb-4">
                <div className="text-yellow-700 font-semibold">
                  {capitalizeString(playerPokemon.name)} leveled up! Now at
                  level {playerPokemon.level + 1}.
                </div>
              </div>
            )}

            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-6 rounded-lg shadow transition duration-200"
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
