import React, { useEffect, useState } from "react";
import { IPokemonMergedProps } from "../../PokemonParty";
import Pokemon, {
  generatePokemonToBattle,
} from "../../../utils/pokemonToBattleHelpers";
import { pokeData } from "../../../../store/pokemonDataStore";
import BattleActionButtons from "../battleScreenComponents/BattleActionButtons";
import BattleCard from "../battleScreenComponents/BattleCard";
import BattleLog from "../battleScreenComponents/BattleLog";
import { capitalizeString, checkPokemonIsSeen } from "../../../utils/helperfn";
import { battleLogStore } from "../../../../store/battleLogStore";
import BattleOverCard from "../battleScreenComponents/BattleOverCard";

interface IWilderness {
  playerPokemon: IPokemonMergedProps;
}

const Wilderness = ({ playerPokemon }: IWilderness) => {
  const [opponentPokemon, setOpponentPokemon] = useState<pokeData>(
    generatePokemonToBattle()
  );

  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );

  useEffect(() => {
    checkPokemonIsSeen(opponentPokemon.pokedex_number);
  }, [opponentPokemon]);

  const [playerHP, setPlayerHP] = useState(playerPokemon.hp);
  const [opponentHP, setOpponentHP] = useState(opponentPokemon.hp);
  const [battleContinues, setBattleContinues] = useState(true);
  const [winner, setWinner] = useState("");

  // Have 2 states for the damage taken in a hit.
  const [playerDamageSustained, setPlayerDamageSustained] = useState(0);
  const [opponentDamageSustained, setOpponentDamageSustained] = useState(0);

  // useEffect(() => {
  //   alert(winner);
  // }, [battleContinues]);

  // BATTLE VARS FROM POKEMON CLASS
  // Create Pokemon class instances once
  const playerClass = React.useMemo(
    () =>
      new Pokemon({
        name: playerPokemon.name,
        hp: playerHP,
        attack: playerPokemon.attack,
        defense: playerPokemon.defense,
        speed: playerPokemon.speed,
      }),
    [playerPokemon, playerHP]
  );
  const opponentClass = React.useMemo(
    () =>
      new Pokemon({
        name: opponentPokemon.name,
        hp: opponentHP,
        attack: opponentPokemon.attack,
        defense: opponentPokemon.defense,
        speed: opponentPokemon.speed,
      }),
    [opponentPokemon, opponentHP]
  );

  // playerClass.attackOpponent(opponentClass); // Pikachu attacks Bulbasaur
  // opponentClass.attackOpponent(playerClass); // Bulbasaur attacks Pikachu

  function checkIfPokemonHasFainted(): boolean {
    // If the battle has already ended, don't proceed
    if (!battleContinues) return false;

    if (playerClass.hp <= 0) {
      // End the battle
      setWinner("opponent");
      setTimeout(() => {
        addToMessageLogInStore(
          `${capitalizeString(opponentPokemon.name)} has won the battle!`
        );
      }, 320);

      // Set battleContinues to false to prevent further actions
      setBattleContinues(false);
      return true;
    } else if (opponentClass.hp <= 0) {
      // End the battle
      setWinner("player");
      setTimeout(() => {
        addToMessageLogInStore(
          `${capitalizeString(playerPokemon.name)} has won the battle!`
        );
      }, 320);

      // Set battleContinues to false to prevent further actions
      setBattleContinues(false);
      return true;
    }

    return false;
  }

  function determineAttackOutcome() {
    const pokemonWithFasterSpeed =
      opponentClass.speed > playerClass.speed ? "opponent" : "player";

    if (pokemonWithFasterSpeed === "player") {
      addToMessageLogInStore(
        `${capitalizeString(playerPokemon.name)} has the faster attack and makes the first move.`
      );
      setTimeout(() => {
        setOpponentDamageSustained(playerClass.attackOpponent(opponentClass));
        setOpponentHP(opponentClass.hp); // Update HP in state
      }, 600);
    } else {
      addToMessageLogInStore(
        `${capitalizeString(opponentPokemon.name)} has the faster attack and makes the first move.`
      );
      setTimeout(() => {
        setPlayerDamageSustained(opponentClass.attackOpponent(playerClass));
        setPlayerHP(playerClass.hp); // Update HP in state
      }, 600);
    }

    if (battleContinues) {
      setTimeout(() => {
        if (pokemonWithFasterSpeed === "opponent") {
          addToMessageLogInStore(
            `${capitalizeString(playerPokemon.name)} attacks in retaliation.`
          );
          setOpponentDamageSustained(playerClass.attackOpponent(opponentClass));
          setOpponentHP(opponentClass.hp); // Update HP in state
        } else {
          addToMessageLogInStore(
            `${capitalizeString(opponentPokemon.name)} attacks in retaliation.`
          );
          setPlayerDamageSustained(opponentClass.attackOpponent(playerClass));
          setPlayerHP(playerClass.hp); // Update HP in state
        }
        checkIfPokemonHasFainted();
      }, 300);
    } // Prevent the next attack from happening
  }

  return (
    <div className="h-full w-full flex flex-col pb-2">
      <div className="h-[65%] w-full flex ">
        <div className="h-full w-full  flex justify-center p-4 ">
          <BattleCard
            pokemon={playerPokemon}
            isLoggedInUser={true}
            pokemonClass={playerClass}
            isPlayer={true}
            playerDamageSustained={playerDamageSustained}
            opponentDamageSustained={opponentDamageSustained}
            winner={winner}
          />
        </div>
        {!battleContinues && <BattleOverCard winner={winner} />}
        <div className="h-full w-full flex justify-center p-4 ">
          <BattleCard
            pokemon={opponentPokemon}
            isLoggedInUser={false}
            pokemonClass={opponentClass}
            isPlayer={false}
            playerDamageSustained={playerDamageSustained}
            opponentDamageSustained={opponentDamageSustained}
            winner={winner}
          />
        </div>
      </div>
      <BattleActionButtons
        playerPokemon={playerPokemon}
        playerClass={playerClass}
        opponentPokemon={opponentPokemon}
        opponentClass={opponentClass}
        determineAttackOutcome={determineAttackOutcome}
        battleContinues={battleContinues}
        setBattleContinues={setBattleContinues}
      />

      <div className="h-[22%] w-[100%]  flex justify-center items-center">
        <BattleLog
          playerPokemon={playerPokemon}
          opponentPokemon={opponentPokemon}
        />
      </div>
    </div>
  );
};

export default Wilderness;
