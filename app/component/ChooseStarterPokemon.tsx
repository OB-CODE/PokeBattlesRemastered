"use client";
import React, { MouseEvent, useEffect } from "react";
import { useState } from "react";
import Modal from "../Modal";
import Image from "next/image";
import { loggedStore } from "../../store/userLogged";

import { Caprasimo } from "next/font/google";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { checkPokemonIsCaught, checkPokemonIsSeen } from "../utils/helperfn";
import LoadingOaksLab from "./LoadingOaksLab";
import { pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

// console.log(CaprasimoFont);

const ChooseStarterPokemon = () => {
  const hasFirstPokemon = loggedStore((state) => state.hasPokemon);
  const toggleHasFirstPokemon = loggedStore(
    (state) => state.toggleHasFirstPokemon
  );

  // BasePokemon store - When populated, load the game.
  const basePokemon = pokemonDataStore((state) => state.pokemonMainArr);
  const usersPokemonStats = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );
  const [isHoveredBulbasaur, setIsHoveredBulbasaur] = useState(false);
  const [isHoveredCharmander, setIsHoveredCharmander] = useState(false);
  const [isHoveredSquirtle, setIsHoveredSquirtle] = useState(false);

  // API call to retrieve selected Pokemon Data:
  const apiCall = async (pokedexID: number) => {
    console.log("api button call working");

    try {
      const response = await fetch(
        `https://tsb9gdpls1.execute-api.ap-southeast-2.amazonaws.com/accessPokeDB/${pokedexID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers': 'Content-Type',
            // 'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
          },
        }
      );

      // Converts the JSON to JS object
      const responseData = await response.json();
      console.log(responseData.response);
    } catch (error) {
      console.error("Error in code:", error);
    }
  };

  // <button className="px-2 bg-green-300" onClick={apiCall}>
  //       Call API Gateway
  //     </button>

  // state to determine when a pokemon has been cicked on:
  const [BulbasaurSelectedViaCick, setBulbasaurSelectedViaCick] =
    useState(false);
  const [CharmanderSelectedViaCick, setCharmanderSelectedViaCick] =
    useState(false);
  const [SquirtleSelectedViaCick, setSquirtleSelectedViaCick] = useState(false);

  const [pokemonSelectedModalOpen, setPokemonSelectedModalOpen] =
    useState(false);

  const pokemonSelectedCloseModal = () => {
    setPokemonSelectedModalOpen(false);
  };

  const [pokemonSelectedStored, setpokemonSelectedStored] = useState("");

  type PokemonName = "Bulbasaur" | "Charmander" | "Squirtle";

  const pokemonImageForStarter: Record<
    PokemonName,
    {
      image: string;
      colour: String;
      colourHover: String;
      type: String;
    }
  > = {
    Bulbasaur: {
      image: "/starter_pokemon_bulbasaur.png",
      colour: "bg-green-600",
      colourHover: "hover:bg-green-800",
      type: "icons/bug.svg",
    },
    Charmander: {
      image: "/starter_pokemon_charmander.png",
      colour: "bg-red-600",
      colourHover: "hover:bg-red-800",
      type: "icons/fire.svg",
    },
    Squirtle: {
      image: "/starter_pokemon_squirtle.png",
      colour: "bg-blue-600",
      colourHover: "hover:bg-blue-800",
      type: "icons/water.svg",
    },
  };

  // code for the Selected Pokemeon Modal
  let modalBody = (
    <div className="flex flex-col gap-3">
      <div className="text-4xl">{pokemonSelectedStored}</div>

      <div className="flex flex-col justify-center items-start">
        <div className="w-full flex justify-between">
          <button
            onClick={() => {
              toggleHasFirstPokemon();
              pokemonSelectedCloseModal();
              if (pokemonSelectedStored == "Bulbasaur") {
                checkPokemonIsCaught(1);
              } else if (pokemonSelectedStored == "Charmander") {
                checkPokemonIsCaught(4);
              } else if (pokemonSelectedStored == "Squirtle") {
                checkPokemonIsCaught(7);
              }
            }}
            type="button"
            className={`mb-3 inline-flex w-fit justify-center rounded-md ${
              pokemonImageForStarter[pokemonSelectedStored as PokemonName]
                ?.colour
            } ${
              pokemonImageForStarter[pokemonSelectedStored as PokemonName]
                ?.colourHover
            } px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600`}
          >
            Choose: {pokemonSelectedStored}
          </button>
          <div
            className={`${
              pokemonImageForStarter[pokemonSelectedStored as PokemonName]
                ?.colour
            } rounded-full`}
          >
            <Image
              src={pokemonImageForStarter[
                pokemonSelectedStored as PokemonName
              ]?.type.toString()}
              width={50}
              height={50}
              alt={pokemonSelectedStored}
            />
          </div>
        </div>

        <Image
          // The (?.) is called the "Optional Chaining" operator. It was introduced in ECMAScript 2020 (ES11). The optional chaining operator allows you to read the value of a property located deep within a chain of connected objects without having to explicitly check if each reference in the chain is valid (not null or undefined).
          src={
            pokemonImageForStarter[pokemonSelectedStored as PokemonName]?.image
          }
          width={350}
          height={350}
          alt={pokemonSelectedStored}
        />
      </div>
    </div>
  );

  function pokemonClickedDuringSelection(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    let pokemeonSelected = (e.target as HTMLButtonElement).id;

    //  TODO: Set API up to send back the pokemon that matches the ID given to it. Use the target.id from the selection.
    let pokedexID = 0;

    // input name for modal card
    setpokemonSelectedStored(pokemeonSelected);
    console.log(pokemeonSelected);
    if (pokemeonSelected == "Bulbasaur") {
      setBulbasaurSelectedViaCick(true);
      pokedexID = 1;
    } else if (pokemeonSelected == "Charmander") {
      setCharmanderSelectedViaCick(true);
      pokedexID = 4;
    } else if (pokemeonSelected == "Squirtle") {
      setSquirtleSelectedViaCick(true);
      pokedexID = 7;
    }
    setPokemonSelectedModalOpen(true);
    console.log(pokedexID);

    apiCall(pokedexID);
  }

  const [readyDataForPokemonSelection, setReadyDataForPokemonSelection] =
    useState(false);

  useEffect(() => {
    // setTimeout(() => {
    if (basePokemon.length > 1 && usersPokemonStats.length > 0) {
      setReadyDataForPokemonSelection(true);
      if (isHoveredCharmander != false) {
        checkPokemonIsSeen(4);
      }
    }

    // }, 1200);
  }, [basePokemon, usersPokemonStats]);

  return (
    <>
      {readyDataForPokemonSelection ? (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className={`${CaprasimoFont.className} text-4xl pb-2`}>
            Choose Your Starter Pokemon
          </div>
          <div
            className="h-[80%] w-[100%] bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: "url(/bg_professor_oaks_lab.png)",
            }}
          >
            <div className="h-full w-full flex justify-center items-center pt-5 md:pt-12 ">
              <div className="w-[100%] max-w-[1200px] ml-2 md:ml-4 flex justify-between items-center">
                <button
                  id="Bulbasaur"
                  onClick={pokemonClickedDuringSelection}
                  className="w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%] hover:cursor-pointer"
                  style={{
                    backgroundImage: isHoveredBulbasaur
                      ? "url(/selected_bulbasaur.png)"
                      : "url(/pokeball_close.png)",
                    transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
                  }}
                  onMouseEnter={() => {
                    checkPokemonIsSeen(1);
                    setIsHoveredBulbasaur(true);
                  }}
                  onMouseLeave={() => setIsHoveredBulbasaur(false)}
                ></button>
                <button
                  id="Charmander"
                  onClick={pokemonClickedDuringSelection}
                  className="md:ml-4 w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%] hover:cursor-pointer"
                  style={{
                    backgroundImage: isHoveredCharmander
                      ? "url(/selected_charmander.png)"
                      : "url(/pokeball_close.png)",
                    transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
                  }}
                  onMouseEnter={() => {
                    checkPokemonIsSeen(4);
                    setIsHoveredCharmander(true);
                  }}
                  onMouseLeave={() => {
                    // checkPokemonIsSeen(4);
                    setIsHoveredCharmander(false);
                  }}
                ></button>
                <button
                  id="Squirtle"
                  onClick={pokemonClickedDuringSelection}
                  className="w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%] hover:cursor-pointer"
                  style={{
                    backgroundImage: isHoveredSquirtle
                      ? "url(/selected_squirtle.png)"
                      : "url(/pokeball_close.png)",
                    transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
                  }}
                  onMouseEnter={() => {
                    checkPokemonIsSeen(7);
                    setIsHoveredSquirtle(true);
                  }}
                  onMouseLeave={() => setIsHoveredSquirtle(false)}
                ></button>
              </div>
            </div>
          </div>
          <Modal
            open={pokemonSelectedModalOpen}
            onClose={pokemonSelectedCloseModal}
            content={{
              heading: "",
              body: modalBody,
              closeMessage: "Choose a different Pokemon",
              iconChoice: (
                <Image
                  src="/ball.png"
                  width={150}
                  height={150}
                  alt="pokeBall"
                />
              ),
            }}
          />
        </div>
      ) : (
        <LoadingOaksLab />
      )}
    </>
  );
};
export default ChooseStarterPokemon;
