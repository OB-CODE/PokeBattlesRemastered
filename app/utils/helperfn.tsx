"use client";
import { toast, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pokeData, pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
import { itemsStore } from "../../store/itemsStore";
import { api } from "./apiCallsNext";

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
  return caughtPokemonTotal;
}

export function calculateSeenPokemon(): number {
  const seenPokemonTotal = userPokemonDetailsStore
    .getState()
    .userPokemonData.filter((pokemon) => pokemon.seen === true).length;
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

export async function checkPokemonIsCaught(
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
  }

  // check how many are in the Pokemon Party - If under 5 add caught Pokemon to the party.
  const currentParty = userPokemonDetailsStore
    .getState()
    .userPokemonData.filter((pokemon) => pokemon.inParty === true);

  if (userId) {
    try {
      await api.updatePokemon(
        id,
        userId, // Auth0 user ID
        {
          caught: true,
          orderCaught: calculateCaughtPokemon(),
          inParty: currentParty.length < 5 ? true : false, // If under 5, add to party
        }
      );
    } catch (error) {
      console.error("Failed to update caught status:", error);
    }
  } else {
    // If no userId is provided, we can still update the store directly
    userPokemonDetailsStore.getState().updateUserPokemonData(id, {
      caught: true,
      orderCaught: calculateCaughtPokemon(),
      inParty: currentParty.length < 5 ? true : false, // If under 5, add to party
    });
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

  let combinedPokemonDataToReturn = {
    ...pokemonForPokedexDetalis,
    seen: userDetails!.seen,
    caught: userDetails!.caught,
    orderCaught: userDetails!.orderCaught,
    orderSeen: userDetails!.orderSeen,
    battlesFought: userDetails!.battlesFought,
    battlesWon: userDetails!.battlesWon,
    battlesLost: userDetails!.battlesLost,
  };

  return combinedPokemonDataToReturn;
}

export function increaseMoneyAfterBattle(battleLocationID: number): number {
  const currentMoney = itemsStore.getState().moneyOwned;

  // linked to battleLocation id numbers
  let battleAreaEarnings = [
    { id: 1, multiplyer: 5, base: 5, location: "Town Farmlands" },
    { id: 2, multiplyer: 10, base: 10, location: "Wilderness" },
    { id: 3, multiplyer: 10, base: 20, location: "Fire realm" },
    { id: 9, multiplyer: 50, base: 100, location: "Tournament" },
    { id: 10, multiplyer: 50, base: 50, location: "Rare" },
  ];

  const battleArea = battleAreaEarnings.find(
    (area) => area.id === battleLocationID
  );

  let moneyEarned = 0;
  if (battleArea) {
    moneyEarned =
      Math.floor(Math.random() * battleArea?.multiplyer) + battleArea?.base; // Random money between 50 and 150
  }

  const updateMoney = itemsStore.getState().increaseMoneyOwned;
  updateMoney(moneyEarned);

  return moneyEarned;
}

export function checkPokemonCanEvolve(id: number): {
  canEvolve: boolean;
  evolutionReady: boolean;
  levelEvolves?: number;
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
    return { canEvolve: false, evolutionReady: false };
  }

  // Check if the Pokémon can evolve at all
  if (!pokemonBaseStats.canEvolve) {
    return { canEvolve: false, evolutionReady: false };
  }

  // Check if the Pokémon has met the level requirement to evolve
  const evolutionReady = userPokemonData.level >= (pokemonBaseStats.levelEvolves || Infinity);

  return {
    canEvolve: pokemonBaseStats.canEvolve,
    evolutionReady,
    levelEvolves: pokemonBaseStats.levelEvolves,
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
  await checkPokemonIsCaught(evolutionTargetId, userId);
  
  // Get the evolved Pokémon's data after it has been marked as caught
  const evolvedPokemon = userPokemonDetailsStore
    .getState()
    .userPokemonData.find((p) => p.pokedex_number === evolutionTargetId);
  
  if (!evolvedPokemon) {
    return false;
  }
  
  // Transfer relevant stats from the original Pokémon
  const updatedEvolvedData = {
    level: currentPokemon.level,
    experience: currentPokemon.experience,
    inParty: currentPokemon.inParty,
    nickname: currentPokemon.nickname === currentPokemon.pokedex_number.toString() 
      ? evolutionTargetBase.name // If nickname was default, use the new Pokémon's name
      : currentPokemon.nickname, // Otherwise keep the nickname
  };
  
  // Update the evolved Pokémon with the transferred stats
  if (userId) {
    try {
      await api.updatePokemon(
        evolutionTargetId,
        userId,
        updatedEvolvedData
      );
    } catch (error) {
      console.error("Failed to update evolved Pokemon:", error);
      return false;
    }
  }
  
  // Remove the original Pokémon from the party
  if (userId) {
    try {
      await api.updatePokemon(
        currentPokemonId,
        userId,
        {
          inParty: false
        }
      );
    } catch (error) {
      console.error("Failed to update original Pokemon:", error);
    }
  }
  
  // Show a success toast
  toast.success(
    <span className="">
      <span>Congratulations! </span>
      <span className="font-bold capitalize">{currentPokemon.nickname || pokemonDataStore.getState().pokemonMainArr.find(p => p.pokedex_number === currentPokemonId)?.name}</span>
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
      theme: "colored" 
    }
  );
  
  return true;
}
