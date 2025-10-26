"use client";
import { toast, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pokeData, pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore, {
  PokemonAcquisitionMethod,
} from "../../store/userPokemonDetailsStore";
import { itemsStore } from "../../store/itemsStore";
import { api } from "./apiCallsNext";
import { getBattleLocationDetails } from "./UI/Core/battleLocations";
import {
  applyLevelMultipliers,
  getEvolutionBonusText,
} from "./pokemonToBattleHelpers";
import { useScoreSystem, SCORE_CONSTANTS } from "../../store/scoringSystem";
import { accountStatsStore } from "../../store/accountStatsStore";

export function capitalizeString(string: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function notifyTM(message: string) {
  toast.info(`${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

export function constructionToast() {
  toast.info(`Feature under construction`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style: { backgroundColor: "yellow", color: "black" },
  });
}

// Pokemon Specific Functions
export function calculateCaughtPokemon(): number {
  const caughtPokemonTotal = userPokemonDetailsStore
    .getState()
    .userPokemonData.filter((pokemon) => pokemon.caught === true).length;

  // Update the store with the new total
  const { setTotalPokemonCaught } = accountStatsStore.getState();
  setTotalPokemonCaught(caughtPokemonTotal);

  return caughtPokemonTotal;
}

export function calculateSeenPokemon(): number {
  const seenPokemonTotal = userPokemonDetailsStore
    .getState()
    .userPokemonData.filter((pokemon) => pokemon.seen === true).length;

  // Update the store with the new total
  const { setTotalPokemonSeen } = accountStatsStore.getState();
  setTotalPokemonSeen(seenPokemonTotal);

  return seenPokemonTotal;
}

// FOR TOAST
interface ISuccessTopLeftToast {
  position: ToastPosition;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  theme: string;
}

let successTopLeftToast: ISuccessTopLeftToast = {
  position: "top-left" as ToastPosition,
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  // transition: "Flip",
};

export async function checkPokemonIsSeen(
  id: number,
  userId?: string | undefined
) {
  let pokemonIdToCheck = userPokemonDetailsStore
    .getState()
    .userPokemonData.find((pokemon) => {
      return pokemon.pokedex_number == id;
    });
  let pokemonBaseStats = pokemonDataStore
    .getState()
    .pokemonMainArr.find((pokemon) => {
      return pokemon.pokedex_number == id;
    });

  if (pokemonIdToCheck?.seen == false) {
    pokemonIdToCheck.seen = true;
    toast.info(
      <span className="">
        <span> Pokedex Updated:</span>
        <span className="font-bold capitalize">{pokemonBaseStats?.name}</span>
        <span> marked as seen. New count </span>
        <span className="font-bold"> = {calculateSeenPokemon()} / 151</span>
      </span>,
      { ...successTopLeftToast }
    );

    // Add points for seeing a new Pokemon
    const scoreSystem = useScoreSystem.getState();
    scoreSystem.addScore(
      SCORE_CONSTANTS.POKEMON_SEEN_POINTS,
      `Saw ${pokemonBaseStats?.name} (#${id}) for the first time.`
    );

    if (userId) {
      try {
        await api.updatePokemon(
          id,
          userId, // Auth0 user ID
          {
            seen: true,
            orderSeen: calculateCaughtPokemon(),
          }
        );
      } catch (error) {
        console.error("Failed to update caught status:", error);
      }
    } else {
      // If no userId is provided, we can still update the store directly
      userPokemonDetailsStore.getState().updateUserPokemonData(id, {
        seen: true,
        orderSeen: calculateCaughtPokemon(),
      });
    }

    userPokemonDetailsStore.getState().updateUserPokemonData(id, {
      seen: true,
      orderSeen: calculateSeenPokemon(),
    }); // only update the ID the Pokemon that was just witnessed.
  }
}

export async function checkPokemonIsCaught({
  id,
  starter,
  userId,
}: {
  id: number;
  starter?: boolean;
  userId?: string;
}) {
  let pokemonIdToCheck = userPokemonDetailsStore
    .getState()
    .userPokemonData.find((pokemon) => {
      return pokemon.pokedex_number == id;
    });
  let pokemonBaseStats = pokemonDataStore
    .getState()
    .pokemonMainArr.find((pokemon) => {
      return pokemon.pokedex_number == id;
    });

  if (pokemonIdToCheck?.caught == false) {
    pokemonIdToCheck.caught = true;
    toast.success(
      <span className="">
        <span> Pokedex Updated:</span>
        <span className="font-bold capitalize">{pokemonBaseStats?.name}</span>
        <span> marked as caught. New count </span>
        <span className="font-bold"> = {calculateCaughtPokemon()} / 151</span>
      </span>,
      { ...successTopLeftToast, position: "top-right" }
    );

    // Add points for catching a new Pokemon
    const scoreSystem = useScoreSystem.getState();
    scoreSystem.addScore(
      SCORE_CONSTANTS.POKEMON_CAUGHT_POINTS,
      `Caught ${pokemonBaseStats?.name} (#${id})`
    );

    // Check for Pokedex milestones after catching
    scoreSystem.checkPokedexMilestones();
  }

  // check how many are in the Pokemon Party - If under 5 add caught Pokemon to the party.
  const currentParty = userPokemonDetailsStore
    .getState()
    .userPokemonData.filter((pokemon) => pokemon.inParty === true);

  // Set default values for newly caught Pokémon
  const updateData = {
    caught: true,
    orderCaught: calculateCaughtPokemon(),
    inParty: currentParty.length < 5 ? true : false, // If under 5, add to party
    active: true, // Newly caught Pokémon are active by default
    evolutions: 0, // No evolutions yet
    acquisitionMethod: starter
      ? "starter"
      : ("caughtInWild" as PokemonAcquisitionMethod), // Mark as caught in wild
  };

  if (userId) {
    try {
      await api.updatePokemon(
        id,
        userId, // Auth0 user ID
        updateData
      );
    } catch (error) {
      console.error("Failed to update caught status:", error);
    }
  } else {
    // If no userId is provided, we can still update the store directly
    userPokemonDetailsStore.getState().updateUserPokemonData(id, updateData);
  }
}

export function returnMergedPokemonList() {
  const pokemonForPokedex = pokemonDataStore.getState().pokemonMainArr;
  const userPokemonDetails = userPokemonDetailsStore.getState().userPokemonData;

  return pokemonForPokedex.map((pokemon) => {
    const userDetails = userPokemonDetails.find(
      (userPokemon) => userPokemon.pokedex_number === pokemon.pokedex_number
    );
    return {
      ...pokemon,
      seen: userDetails?.seen,
      caught: userDetails?.caught,
    };
  });
}

export function returnMergedPokemonDetailsForSinglePokemon(
  indexNumber: number
) {
  const pokemonForPokedex = pokemonDataStore.getState().pokemonMainArr;
  const userPokemonDetails = userPokemonDetailsStore.getState().userPokemonData;

  const userDetails = userPokemonDetails.find(
    (userPokemon) => userPokemon.pokedex_number === indexNumber
  )!;

  const pokemonForPokedexDetalis: pokeData = pokemonForPokedex.find(
    (pokemonData) => pokemonData.pokedex_number === indexNumber
  )!;

  // Apply level multipliers for stats
  const {
    hpMultiplier,
    speedMultiplier,
    attackMultiplier,
    defenceMultiplier,
    hasEvolutionBonus,
    evolutionCount,
  } = applyLevelMultipliers(
    userDetails!.level,
    userDetails!.evolutions || 0,
    userDetails!.acquisitionMethod
  );

  // Apply multipliers to base stats
  const maxHp = Math.round(pokemonForPokedexDetalis.hp * hpMultiplier);
  const attack = Math.round(pokemonForPokedexDetalis.attack * attackMultiplier);
  const defense = Math.round(
    pokemonForPokedexDetalis.defense * defenceMultiplier
  );
  const speed = Math.round(pokemonForPokedexDetalis.speed * speedMultiplier);
  const evolutionBonusText = getEvolutionBonusText(
    userDetails!.evolutions || 0,
    userDetails!.acquisitionMethod
  );

  let combinedPokemonDataToReturn = {
    ...pokemonForPokedexDetalis,
    // User Pokemon Data properties
    pokedex_number: userDetails!.pokedex_number,
    user_id: userDetails!.user_id,
    nickname: userDetails!.nickname,
    seen: userDetails!.seen,
    caught: userDetails!.caught,
    level: userDetails!.level,
    experience: userDetails!.experience,
    orderSeen: userDetails!.orderSeen,
    orderCaught: userDetails!.orderCaught,
    battlesFought: userDetails!.battlesFought,
    battlesWon: userDetails!.battlesWon,
    battlesLost: userDetails!.battlesLost,
    remainingHp: userDetails!.remainingHp || maxHp,
    inParty: userDetails!.inParty,
    // Include the new evolution-related fields
    active: userDetails!.active,
    evolutions: userDetails!.evolutions,
    acquisitionMethod: userDetails!.acquisitionMethod,
    evolvedFrom: userDetails!.evolvedFrom,
    evolvedTo: userDetails!.evolvedTo,
    evolvedAt: userDetails!.evolvedAt,
    // Stats with multipliers applied
    maxHp: maxHp,
    hp: userDetails!.remainingHp || maxHp,
    attack: attack,
    defense: defense,
    speed: speed,
    // Evolution bonus info
    hasEvolutionBonus: hasEvolutionBonus,
    evolutionBonusText: evolutionBonusText,
  };

  return combinedPokemonDataToReturn;
}

export function increaseMoneyAfterBattle(battleLocationID: number): number {
  // linked to battleLocation id numbers

  let battleAreaEarnings = getBattleLocationDetails();

  const battleArea = battleAreaEarnings.find(
    (area) => area.id === battleLocationID
  );

  let moneyEarned = 0;
  if (battleArea) {
    moneyEarned =
      Math.floor(Math.random() * battleArea?.potentialBonus) +
      battleArea?.baseMoneyEarnt; // Random money between 50 and 150
  }

  const updateMoney = itemsStore.getState().increaseMoneyOwned;
  updateMoney(moneyEarned);

  return moneyEarned;
}

export function checkLevelMilestones(oldLevel: number, newLevel: number) {
  // Get the scoring system
  const scoreSystem = useScoreSystem.getState();

  // Check if we've crossed any milestone levels
  const milestones = [
    { level: 5, bonus: SCORE_CONSTANTS.LEVEL_5_BONUS },
    { level: 10, bonus: SCORE_CONSTANTS.LEVEL_10_BONUS },
    { level: 15, bonus: SCORE_CONSTANTS.LEVEL_15_BONUS },
  ];

  // Check each milestone
  milestones.forEach(({ level, bonus }) => {
    // If we've crossed this milestone level (old level is below, new level is at or above)
    if (oldLevel < level && newLevel >= level) {
      // Award the points for this milestone
      scoreSystem.addScore(bonus, `Reached level ${level} milestone`);
    }
  });
}

export function checkPokemonCanEvolve(id: number): {
  canEvolve: boolean;
  evolutionReady: boolean;
  levelEvolves?: number;
  active: boolean;
} {
  // Get the Pokémon's base data to check if it can evolve at all
  const pokemonBaseStats = pokemonDataStore
    .getState()
    .pokemonMainArr.find((pokemon) => pokemon.pokedex_number === id);

  // Get user's Pokémon data to check current level
  const userPokemonData = userPokemonDetailsStore
    .getState()
    .userPokemonData.find((pokemon) => pokemon.pokedex_number === id);

  // Default result if Pokémon or data is not found
  if (!pokemonBaseStats || !userPokemonData) {
    return { canEvolve: false, evolutionReady: false, active: false };
  }

  // Check if the Pokémon is active (not already evolved)
  const isActive = userPokemonData.active !== false; // If active is undefined, consider it true

  // If the Pokémon is not active (already evolved), it cannot evolve again
  if (!isActive) {
    return { canEvolve: false, evolutionReady: false, active: false };
  }

  // Check if the Pokémon can evolve at all
  if (!pokemonBaseStats.canEvolve) {
    return { canEvolve: false, evolutionReady: false, active: true };
  }

  // Check if the Pokémon has met the level requirement to evolve
  const evolutionReady =
    userPokemonData.level >= (pokemonBaseStats.levelEvolves || Infinity);

  return {
    canEvolve: pokemonBaseStats.canEvolve,
    evolutionReady,
    levelEvolves: pokemonBaseStats.levelEvolves,
    active: true,
  };
}

// This helper function gets the pokedex number of the Pokémon that this one evolves into
export function getEvolutionTarget(pokedex_number: number): number | null {
  // Simple evolution rules based on pokedex numbers:
  // Most first-stage Pokémon evolve to the next number
  // Second-stage Pokémon evolve to the number after that

  // First-stage Pokémon (like Bulbasaur, Charmander, Squirtle) evolve to pokedex_number + 1
  // Second-stage Pokémon (like Ivysaur, Charmeleon, Wartortle) evolve to pokedex_number + 1

  // Check if this is a Pokémon that can evolve
  const { canEvolve } = checkPokemonCanEvolve(pokedex_number);

  if (!canEvolve) {
    return null;
  }

  // Most Pokémon just evolve to the next number
  return pokedex_number + 1;
}

export async function evolvePokemon(
  currentPokemonId: number,
  userId?: string | undefined
): Promise<boolean> {
  // Get information about the current Pokémon
  const evolutionCheck = checkPokemonCanEvolve(currentPokemonId);

  // If the Pokémon can't evolve or isn't ready, return false
  if (!evolutionCheck.canEvolve || !evolutionCheck.evolutionReady) {
    return false;
  }

  // Get the scoring system
  const scoreSystem = useScoreSystem.getState();

  // Get the evolution target's pokedex number
  const evolutionTargetId = getEvolutionTarget(currentPokemonId);

  if (!evolutionTargetId) {
    return false;
  }

  // Get the current Pokémon's data
  const currentPokemon = userPokemonDetailsStore
    .getState()
    .userPokemonData.find((p) => p.pokedex_number === currentPokemonId);

  // Get the evolution target's base data
  const evolutionTargetBase = pokemonDataStore
    .getState()
    .pokemonMainArr.find((p) => p.pokedex_number === evolutionTargetId);

  if (!currentPokemon || !evolutionTargetBase) {
    return false;
  }

  // Mark the evolution target as seen and caught
  await checkPokemonIsSeen(evolutionTargetId, userId);
  await checkPokemonIsCaught({ id: evolutionTargetId, userId: userId });

  // Get the evolved Pokémon's data after it has been marked as caught
  const evolvedPokemon = userPokemonDetailsStore
    .getState()
    .userPokemonData.find((p) => p.pokedex_number === evolutionTargetId);

  if (!evolvedPokemon) {
    return false;
  }

  // Record the current time for evolution timestamp
  const currentTimestamp = new Date();

  // Transfer relevant stats from the original Pokémon
  const updatedEvolvedData = {
    level: currentPokemon.level,
    experience: currentPokemon.experience,
    inParty: currentPokemon.inParty,
    // Transfer nickname if it exists, otherwise use the new Pokémon's name
    nickname: currentPokemon.nickname || evolutionTargetBase.name,
    active: true, // Set the evolved Pokémon as active
    acquisitionMethod: "evolved" as const, // Mark as acquired through evolution
    evolvedFrom: currentPokemonId, // Record which Pokémon it evolved from
    evolvedAt: currentTimestamp, // Record when it evolved
    // Increment evolution count (or set to 1 if undefined)
    evolutions: (currentPokemon.evolutions || 0) + 1,
    // Transfer battle statistics
    battlesFought: currentPokemon.battlesFought || 0,
    battlesWon: currentPokemon.battlesWon || 0,
    battlesLost: currentPokemon.battlesLost || 0,
  };

  // Update the evolved Pokémon with the transferred stats
  if (userId) {
    try {
      await api.updatePokemon(evolutionTargetId, userId, updatedEvolvedData);
    } catch (error) {
      console.error("Failed to update evolved Pokemon:", error);
      return false;
    }
  } else {
    // Update the store directly if no userId provided
    userPokemonDetailsStore
      .getState()
      .updateUserPokemonData(evolutionTargetId, updatedEvolvedData);
  }

  // Set the original Pokémon as inactive and record what it evolved into
  const originalPokemonUpdate = {
    inParty: false,
    active: false,
    evolvedTo: evolutionTargetId,
    evolvedAt: currentTimestamp,
  };

  if (userId) {
    try {
      await api.updatePokemon(currentPokemonId, userId, originalPokemonUpdate);
    } catch (error) {
      console.error("Failed to update original Pokemon:", error);
    }
  } else {
    // Update the store directly if no userId provided
    userPokemonDetailsStore
      .getState()
      .updateUserPokemonData(currentPokemonId, originalPokemonUpdate);
  }

  // Show a success toast
  toast.success(
    <span className="">
      <span>Congratulations! </span>
      <span className="font-bold capitalize">
        {currentPokemon.nickname ||
          pokemonDataStore
            .getState()
            .pokemonMainArr.find((p) => p.pokedex_number === currentPokemonId)
            ?.name}
      </span>
      <span> evolved into </span>
      <span className="font-bold capitalize">{evolutionTargetBase.name}!</span>
    </span>,
    {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }
  );

  // Add points for evolution
  scoreSystem.addScore(
    SCORE_CONSTANTS.EVOLUTION_BONUS,
    `${currentPokemon.nickname || evolutionTargetBase.name} evolved from ${pokemonDataStore.getState().pokemonMainArr.find((p) => p.pokedex_number === currentPokemonId)?.name}`
  );

  return true;
}
