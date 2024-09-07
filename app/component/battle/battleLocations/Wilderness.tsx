import React, { useEffect, useState } from "react";
import { IPokemonMergedProps } from "../../PokemonParty";
import Pokemon, {
  generatePokemonToBattle,
} from "../../../utils/pokemonToBattleHelpers";
import { pokeData } from "../../../../store/pokemonDataStore";
import BattleActionButtons from "../battleScreenComponents/BattleActionButtons";
import BattleCard from "../battleScreenComponents/BattleCard";
import BattleLog from "../battleScreenComponents/BattleLog";
import { checkPokemonIsSeen } from "../../../utils/helperfn";

interface IWilderness {
  playerPokemon: IPokemonMergedProps;
}

const Wilderness = ({ playerPokemon }: IWilderness) => {
  const [opponentPokemon, setOpponentPokemon] = useState<pokeData>(
    generatePokemonToBattle()
  );

  useEffect(() => {
    checkPokemonIsSeen(opponentPokemon.pokedex_number);
  }, [opponentPokemon]);

  const [playerHP, setPlayerHP] = useState(playerPokemon.hp);
  const [opponentHP, setOpponentHP] = useState(opponentPokemon.hp);
  const [battleContinues, setBattleContinues] = useState(true);
  const [winner, setWinner] = useState("");

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

  function checkIfPokemonHasFainted() {
    if (playerHP <= 0) {
      setWinner("opponent");
      setBattleContinues(false);
    } else if (opponentHP <= 0) {
      setWinner("player");
      setBattleContinues(false);
    }
  }

  function determineAttackOutcome() {
    const pokemonWithFasterSpeed =
      opponentClass.speed > playerClass.speed ? "opponent" : "player";

    if (pokemonWithFasterSpeed === "player") {
      playerClass.attackOpponent(opponentClass);
      setOpponentHP(opponentClass.hp); // Update HP in state
    } else {
      opponentClass.attackOpponent(playerClass);
      setPlayerHP(playerClass.hp); // Update HP in state
    }

    checkIfPokemonHasFainted();

    if (!battleContinues) return;

    if (pokemonWithFasterSpeed === "opponent") {
      playerClass.attackOpponent(opponentClass);
      setOpponentHP(opponentClass.hp); // Update HP in state
    } else {
      opponentClass.attackOpponent(playerClass);
      setPlayerHP(playerClass.hp); // Update HP in state
    }
  }

  return (
    <div className="h-full w-full flex flex-col pb-2">
      <div className="h-[70%] w-full flex">
        <div className="h-full w-full  flex justify-center p-4 ">
          <BattleCard
            pokemon={playerPokemon}
            isLoggedInUser={true}
            pokemonClass={playerClass}
          />
        </div>
        <div className="h-full w-full flex justify-center p-4 ">
          <BattleCard
            pokemon={opponentPokemon}
            isLoggedInUser={false}
            pokemonClass={opponentClass}
          />
        </div>
      </div>
      <BattleActionButtons
        playerPokemon={playerPokemon}
        opponentPokemon={opponentPokemon}
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
