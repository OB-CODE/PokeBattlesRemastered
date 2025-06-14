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

export function checkPokemonIsSeen(id: number) {
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

    if (userId) {
      try {
        await api.updatePokemon(
          id,
          userId, // Auth0 user ID
          {
            caught: true,
            orderCaught: calculateCaughtPokemon(),
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
      });
    }
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
