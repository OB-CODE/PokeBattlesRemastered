"use client";

// import Image from "next/image";
import StartButtons from "./StartButtons";
import { useEffect, useState } from "react";
// once the user is logged in, display the main page.
import GameMainPage from "./GameMainPage";
import { loggedStore } from "../store/userLogged";
import { ToastContainer } from "react-toastify";
import { GetAllBasePokemonDetails } from "./utils/apiCallsNext";
import { calculateCaughtPokemon, calculateSeenPokemon } from "./utils/helperfn";
import { pokemonDataStore } from "../store/pokemonDataStore";
import userPokemonDetailsStore from "../store/userPokemonDetailsStore";

export default function Home() {
  const loggedState = loggedStore((state) => state.loggedIn);
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);

  const pokemonForPokedex = pokemonDataStore((state) => state.pokemonMainArr);
  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  useEffect(() => {
    GetAllBasePokemonDetails();
  }, []);

  const [caughtNumber, setCaughtNumber] = useState(0);
  const [seenNumber, setSeenNumber] = useState(0);

  useEffect(() => {
    let caught = calculateCaughtPokemon();
    setCaughtNumber(caught);
    let seen = calculateSeenPokemon();
    setSeenNumber(seen);
  }, [userPokemonDetails]);

  return (
    <main className="flex min-h-screen h-full flex-col items-center w-full">
      <ToastContainer />
      <div className="min-h-screen h-full w-full">
        <div
          className="w-full h-full absolute bg-repeat"
          style={{
            backgroundImage: "url(/tiled.png)",
            backgroundSize: "auto 30%",
            // height: '800px',
            // width: '800px' // Set the desired width and height for the background image
          }}
        ></div>
        <div className="w-full h-full absolute ">
          <div className="holderForBannerBubbles w-full h-[100px] pt-2 w-full px-8 sm:px-1  flex  flex-wrap flex-row items-center justify-between font-mono text-sm ">
            <div className="m-1 p-1 mx-4  flex  w-auto justify-center border-b border-blue-300 bg-gradient-to-b from-blue-200 pb-4 pt-4 backdrop-blur-2xl  rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              {/* if dark d=mode use above: dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit */}
              <div className="flex">
                {loggedState ? (
                  <div className="flex items-center">
                    Seen: {seenNumber}/151
                  </div>
                ) : (
                  <div className="flex gap-2 w-full">
                    <div> Pokemon Remastered</div>
                    <div className="hidden sm:flex">- Remade with Next.JS</div>
                  </div>
                )}
              </div>
            </div>
            <div className="m-1 p-1 mx-4 invisible md:visible flex w-auto justify-center border-b border-red-300 bg-gradient-to-b from-red-200 pb-4 pt-4 backdrop-blur-2xl  rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              {/* if dark d=mode use above:  dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit */}
              {loggedState ? (
                <div className=" flex items-center ">
                  Caught: {caughtNumber}/151
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <div> Hosted with</div>
                  <img src="/vercel.svg" alt="" width={100} height={24} />
                </div>
              )}
              {/* <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={100}
                height={24}
              /> */}
            </div>
          </div>
          {/* wrap div to show change of game screen once the user is logged in */}
          {loggedState ? (
            <GameMainPage />
          ) : (
            <div
              className="flex m-auto mt-[2%] w-[90%] h-[80%] "
              style={{
                backgroundImage: "url(/kanto_map.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                // height: "85%",
              }}
            >
              <div
                className="w-[100%] flex flex-col items-center justify-center gap-20"
                // style={{
                //   backgroundImage: "url(/PokeBattles.png",
                // }}
              >
                <div>
                  <img src="/PokeBattles.png" alt="" width={500} height={500} />
                  {/* <Image
                  src="/PokeBattles.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                /> */}
                </div>
                <StartButtons />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
