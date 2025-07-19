import React, { useEffect, useState } from "react";
import { battleLogStore } from "../../../../store/battleLogStore";
import { pokeData } from "../../../../store/pokemonDataStore";
import { capitalizeString, checkPokemonIsSeen } from "../../../utils/helperfn";
import Pokemon, {
  applyLevelMultipliers,
} from "../../../utils/pokemonToBattleHelpers";
import { IPokemonMergedProps } from "../../PokemonParty";
import { IbattleStateAndTypeInfo } from "../BattleScreen";
import BattleActionButtons from "../battleScreenComponents/BattleActionButtons";
import BattleCard from "../battleScreenComponents/BattleCard";
import BattleLog from "../battleScreenComponents/BattleLog";
import BattleOverCard from "../battleScreenComponents/BattleOverCard";
import userPokemonDetailsStore from "../../../../store/userPokemonDetailsStore";
import { api } from "../../../utils/apiCallsNext";
import { useAuth0 } from "@auth0/auth0-react";
import { useScoreSystem } from "../../../../store/scoringSystem";

export interface IbattleStateAndTypeInfoWithOpponent
  extends IbattleStateAndTypeInfo {
  opponentPokemon: pokeData;
}

const MainBattleLocation = (
  battleStateAndTypeInfo: IbattleStateAndTypeInfoWithOpponent
) => {
  const { playerPokemon, opponentPokemon, battleLocation } =
    battleStateAndTypeInfo;

  const { user } = useAuth0();
  const { onBattleWin, onBattleLoss } = useScoreSystem();

  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );

  useEffect(() => {
    checkPokemonIsSeen(opponentPokemon.pokedex_number, user && user.sub);
  }, [opponentPokemon]);

  const currentPokemonFromStore = userPokemonDetailsStore(
    (state) => state.userPokemonData
  ).find(
    (pokemonData) =>
      pokemonData.pokedex_number === playerPokemon?.pokedex_number
  );

  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  // Set player HP from store data
  const [playerHP, setPlayerHP] = useState(
    currentPokemonFromStore?.remainingHp || playerPokemon!.hp
  );

  // Set opponent HP from the already-multiplied value in opponentPokemon
  const [opponentHP, setOpponentHP] = useState(opponentPokemon.hp);

  // Log initial HP values for debugging
  React.useEffect(() => {
    console.log("Initial HP values:", {
      playerPokemon: playerPokemon?.name,
      playerHP: playerHP,
      opponentPokemon: opponentPokemon.name,
      opponentHP: opponentHP,
      opponentLevel: opponentPokemon.opponentLevel || 1,
      opponentMaxHP: opponentPokemon.maxHp,
    });
  }, [playerHP, opponentHP, opponentPokemon, playerPokemon]);

  const [battleContinues, setBattleContinues] = useState(true);
  const [winner, setWinner] = useState("");

  // Store data for the current pokemon  - Update the health here so it carries over after the match.
  // Have 2 states for the damage taken in a hit.
  const [playerDamageSustained, setPlayerDamageSustained] = useState(0);
  const [opponentDamageSustained, setOpponentDamageSustained] = useState(0);

  const [loadedComplete, setLoadedComplete] = useState(false);
  useEffect(() => {
    setLoadedComplete(true);
  }, []);

  const [failedPokeballCapture, setFailedPokeballCapture] = useState(0);

  useEffect(() => {
    if (loadedComplete) {
      determineAttackOutcome(false, true);
    }
  }, [failedPokeballCapture]);

  // BATTLE VARS FROM POKEMON CLASS
  // Create Pokemon class instances once
  const playerClass = React.useMemo(
    () =>
      new Pokemon({
        name: playerPokemon!.name,
        hp: currentPokemonFromStore?.remainingHp || playerPokemon!.hp,
        maxHp: playerPokemon!.maxHp,
        attack: playerPokemon!.attack,
        defense: playerPokemon!.defense,
        speed: playerPokemon!.speed,
      }),
    [playerPokemon, currentPokemonFromStore]
  );

  // Log opponent stats for debugging
  React.useEffect(() => {
    console.log("Opponent Pokémon Stats:", {
      name: opponentPokemon.name,
      level: opponentPokemon.opponentLevel || 1,
      hp: opponentPokemon.hp,
      maxHp: opponentPokemon.maxHp,
      attack: opponentPokemon.attack,
      defense: opponentPokemon.defense,
      speed: opponentPokemon.speed,
    });
  }, [opponentPokemon]);

  // Create the opponent class instance ONLY ONCE with the already multiplied stats
  const opponentClass = React.useMemo(
    () =>
      new Pokemon({
        name: opponentPokemon.name,
        maxHp: opponentPokemon.maxHp,
        hp: opponentPokemon.hp, // Start with the initial HP from the opponent object
        attack: opponentPokemon.attack,
        defense: opponentPokemon.defense,
        speed: opponentPokemon.speed,
      }),
    // Only depend on the initial opponent Pokémon
    [opponentPokemon]
  );

  // Update the HP value in the class when opponentHP changes
  React.useEffect(() => {
    opponentClass.hp = opponentHP;
  }, [opponentHP, opponentClass]);

  function checkIfPokemonHasFainted(messageLogToLoop: string[]): boolean {
    // If the battle has already ended, don't proceed
    if (!battleContinues) return false;

    if (playerClass.hp <= 0) {
      // End the battle
      setWinner("opponent");
      messageLogToLoop.push(
        `${capitalizeString(opponentPokemon.name)} has won the battle!`
      );

      // Register battle loss in scoring system
      onBattleLoss();

      // Set battleContinues to false to prevent further actions
      setBattleContinues(false);
      return true;
    } else if (opponentClass.hp <= 0) {
      // End the battle
      setWinner("player");
      messageLogToLoop.push(
        `${capitalizeString(playerPokemon!.name)} has won the battle!`
      );

      // Register battle win in scoring system with the location ID
      if (battleLocation) {
        onBattleWin(battleLocation);
      }

      // Set battleContinues to false to prevent further actions
      setBattleContinues(false);
      return true;
    }
    return false;
  }

  function perfromAttack(
    attackingPokemon: pokeData | undefined,
    playerPokemon: IPokemonMergedProps | undefined,
    opponentPokemon: pokeData | undefined,
    messageLogToLoop: string[]
  ) {
    if (attackingPokemon === playerPokemon) {
      setOpponentDamageSustained(
        playerClass.attackOpponent(opponentClass, messageLogToLoop).finalDamage
      );
      setOpponentHP(opponentClass.hp); // Update HP in state
    } else {
      const playerInfo = opponentClass.attackOpponent(
        playerClass,
        messageLogToLoop
      );
      setPlayerDamageSustained(playerInfo.finalDamage);

      setPlayerHP(playerInfo.hpLeft);

      if (user && user.sub) {
        api.updatePokemon(playerPokemon!.pokedex_number, user.sub, {
          remainingHp: playerClass.hp,
        });
      } else {
        updateUserPokemonData(playerPokemon!.pokedex_number, {
          remainingHp: playerClass.hp,
        });
      }
    } // Update HP in state
    let hasFainted = checkIfPokemonHasFainted(messageLogToLoop);
    return hasFainted;
  }

  function determineAttackOutcome(isFirstAttack = true, isRetaliation = false) {
    let messageLogToLoop: string[] = [];

    const pokemonAttackingFirst =
      opponentClass.speed > playerClass.speed ? "opponent" : "player";
    const pokemonAttackingSecond =
      opponentClass.speed > playerClass.speed ? "player" : "opponent";

    function performAttackSequence(isFirstAttack: boolean) {
      let attackingPokemon =
        pokemonAttackingFirst === "player" ? playerPokemon : opponentPokemon;
      let defendingPokemon =
        pokemonAttackingFirst === "player" ? opponentPokemon : playerPokemon;

      let doesAttackResultInBattleEnd = false;
      if (isRetaliation) {
        attackingPokemon = opponentPokemon;
        defendingPokemon = playerPokemon;

        messageLogToLoop.push(
          `${capitalizeString(attackingPokemon!.name)} attacks in retaliation.`
        );
        doesAttackResultInBattleEnd = perfromAttack(
          attackingPokemon,
          playerPokemon,
          opponentPokemon,
          messageLogToLoop
        );
        // Already knows it's not the first attack, so no need specify the end in battle.
      } else if (isFirstAttack) {
        messageLogToLoop.push(
          `${capitalizeString(attackingPokemon!.name)} has the faster attack and makes the first move.`
        );
        doesAttackResultInBattleEnd = perfromAttack(
          attackingPokemon,
          playerPokemon,
          opponentPokemon,
          messageLogToLoop
        );
      } else {
        messageLogToLoop.push(
          `${capitalizeString(defendingPokemon!.name)} attacks in retaliation.`
        );
        doesAttackResultInBattleEnd = perfromAttack(
          defendingPokemon,
          playerPokemon,
          opponentPokemon,
          messageLogToLoop
        );
      }
      return doesAttackResultInBattleEnd;
    }

    let doesAttackResultInBattleEnd = performAttackSequence(isFirstAttack);

    if (!doesAttackResultInBattleEnd && isFirstAttack) {
      // If the battle continues
      performAttackSequence(false); // Perform the attack sequence again. False means retaliation.
    }

    messageLogToLoop.forEach((message, index) => {
      setTimeout(() => {
        addToMessageLogInStore(message);
      }, index * 150); // Add a delay of 1 second between each message
    });
  }

  if (!playerPokemon) {
    // Optionally render a loading indicator or return null
    return <div>Loading player pokemon...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col pb-1 overflow-hidden">
      {/* Battle cards section - responsive layout with reduced height */}
      <div className="flex-grow w-full flex flex-col md:flex-row items-center justify-between px-2 relative max-h-[calc(100%-130px)]">
        {/* Player card - left side on desktop, top on mobile */}
        <div className="w-full md:w-1/2 p-1 flex justify-center">
          <BattleCard
            pokemon={playerPokemon}
            isLoggedInUser={true}
            pokemonClass={playerClass}
            isPlayer={true}
            playerDamageSustained={playerDamageSustained}
            opponentDamageSustained={opponentDamageSustained}
            winner={winner}
            playerHP={playerHP}
          />
        </div>

        {/* Opponent card - right side on desktop, bottom on mobile */}
        <div className="w-full md:w-1/2 p-1 flex justify-center">
          <BattleCard
            pokemon={opponentPokemon}
            isLoggedInUser={false}
            pokemonClass={opponentClass}
            isPlayer={false}
            playerDamageSustained={playerDamageSustained}
            opponentDamageSustained={opponentDamageSustained}
            winner={winner}
            playerHP={playerHP}
          />
        </div>

        {/* Battle over card - positioned absolutely over the battle area */}
        {!battleContinues && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <BattleOverCard
              playerPokemon={playerPokemon}
              opponentPokemon={opponentPokemon}
              opponentClass={opponentClass}
              playerClass={playerClass}
              winner={winner}
              battleLocation={battleLocation}
            />
          </div>
        )}
      </div>

      {/* Battle controls section - fixed height for visibility */}
      <div className="w-full">
        {/* Action buttons - smaller padding for more compact view */}
        <div className="px-1 py-1">
          <BattleActionButtons
            playerPokemon={playerPokemon}
            playerClass={playerClass}
            opponentPokemon={opponentPokemon}
            opponentClass={opponentClass}
            determineAttackOutcome={determineAttackOutcome}
            battleContinues={battleContinues}
            setBattleContinues={setBattleContinues}
            setPlayerHP={setPlayerHP}
            setFailedPokeballCapture={setFailedPokeballCapture}
            setWinner={setWinner}
          />
        </div>

        {/* Battle log - reduced height to ensure everything fits */}
        <div className="px-1 py-1 h-28">
          <BattleLog
            playerPokemon={playerPokemon}
            opponentPokemon={opponentPokemon}
          />
        </div>
      </div>
    </div>
  );
};

export default MainBattleLocation;
