"use client";
import React from "react";
import { useState } from "react";
import Modal from "../Modal";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { setAlreadyHasFirstPokemon } from '../../features/user/firstPokemon';



import { Caprasimo } from "next/font/google";
const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

// console.log(CaprasimoFont);

const ChooseStarterPokemon = () => {
  // starting pokemon will need to be moved to store
  const [startingPokemon, setStartingPokemon] = useState("");
  const dispatch = useDispatch();

  const handleFirstPokemonStatusChange = () => {
    dispatch(setAlreadyHasFirstPokemon(true));
  };

  const [isHoveredBulbasaur, setIsHoveredBulbasaur] = useState(false);
  const [isHoveredCharmander, setIsHoveredCharmander] = useState(false);
  const [isHoveredSquirtle, setIsHoveredSquirtle] = useState(false);

  // state to determine when a pokemon has been cicked on:
  const [BulbasaurSelectedViaCick, setBulbasaurSelectedViaCick] =
    useState(false);
  const [CharmanderSelectedViaCick, setCharmanderSelectedViaCick] =
    useState(false);
  const [SquirtleSelectedViaCick, setSquirtleSelectedViaCick] = useState(false);

  const [pokemonSelectedModalOpen, setPokemonSelectedModalOpen] =
    useState(false);

  const pokemonSelectedOpenModal = () => {
    setPokemonSelectedModalOpen(true);
  };

  const pokemonSelectedCloseModal = () => {
    setPokemonSelectedModalOpen(false);
  };

  const [pokemonSelectedStored, setpokemonSelectedStored] = useState("");

  type PokemonName = "Bulbasaur" | "Charmander" | "Squirtle";

  const pokemonImageForStarter: Record<
    PokemonName,
    { image: string; colour: String; colourHover: String; type: String }
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
              setStartingPokemon(pokemonSelectedStored);
              pokemonSelectedCloseModal()
              handleFirstPokemonStatusChange()
                        }
          }
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
              src={
                pokemonImageForStarter[pokemonSelectedStored as PokemonName]
                  ?.type
              }
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

  function pokemonClickedDuringSelection(e) {
    let pokemeonSelected = e.target.id;
    // input name for modal card
    setpokemonSelectedStored(pokemeonSelected);
    console.log(e.target.id);
    if (pokemeonSelected == "Bulbasaur") {
      setBulbasaurSelectedViaCick(true);
    } else if (pokemeonSelected == "Charmander") {
      setCharmanderSelectedViaCick(true);
    } else if (pokemeonSelected == "Squirtle") {
      setSquirtleSelectedViaCick(true);
    }
    setPokemonSelectedModalOpen(true);
  }

  return (
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
            <div
              id="Bulbasaur"
              onClick={pokemonClickedDuringSelection}
              className="w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%]"
              style={{
                backgroundImage: isHoveredBulbasaur
                  ? "url(/selected_bulbasaur.png)"
                  : "url(/pokeball_close.png)",
                transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
              }}
              onMouseEnter={() => {
                setIsHoveredBulbasaur(true);
              }}
              onMouseLeave={() => setIsHoveredBulbasaur(false)}
            ></div>
            <div
              id="Charmander"
              onClick={pokemonClickedDuringSelection}
              className="md:ml-4 w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%]"
              style={{
                backgroundImage: isHoveredCharmander
                  ? "url(/selected_charmander.png)"
                  : "url(/pokeball_close.png)",
                transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
              }}
              onMouseEnter={() => {
                setIsHoveredCharmander(true);
              }}
              onMouseLeave={() => setIsHoveredCharmander(false)}
            ></div>
            <div
              id="Squirtle"
              onClick={pokemonClickedDuringSelection}
              className="w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%]"
              style={{
                backgroundImage: isHoveredSquirtle
                  ? "url(/selected_squirtle.png)"
                  : "url(/pokeball_close.png)",
                transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
              }}
              onMouseEnter={() => {
                setIsHoveredSquirtle(true);
              }}
              onMouseLeave={() => setIsHoveredSquirtle(false)}
            ></div>
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
            <Image src="/ball.png" width={150} height={150} alt="pokeBall" />
          ),
        }}
      />
    </div>
  );
};

export default ChooseStarterPokemon;