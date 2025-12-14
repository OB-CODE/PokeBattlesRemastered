'use client';

// import Image from "next/image";
import { useEffect, useState } from 'react';
import StartButtons from './StartButtons';
// once the user is logged in, display the main page.
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import { loggedStore } from '../store/userLogged';
import userPokemonDetailsStore from '../store/userPokemonDetailsStore';
import GameMainPage from './GameMainPage';
import { GetAllBasePokemonDetails } from './utils/apiCallsNext';
import { calculateCaughtPokemon, calculateSeenPokemon } from './utils/helperfn';
import ImagePreloader from './component/ImagePreloader';

export default function Home() {
  const loggedState = loggedStore((state) => state.loggedIn);
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);

  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  useEffect(() => {
    GetAllBasePokemonDetails(); // TODO: This is where the data is set. Keep spinner loading until this is in store.
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
    <main className="flex flex-col items-center w-full vh-100 relative">
      <ImagePreloader />
      <ToastContainer draggable draggablePercent={30} />
      <div className="w-full vh-100 relative">
        <div
          className="w-full vh-100 absolute bg-repeat"
          style={{
            backgroundImage: 'url(/tiled.png)',
            backgroundSize: 'auto 30%',
          }}
        ></div>
        <div className="w-full vh-100 absolute flex flex-col items-center justify-center">
          {/* wrap div to show change of game screen once the user is logged in */}
          {loggedState ? (
            <GameMainPage />
          ) : (
            <div
              className="flex m-auto w-[95%] h-[95%] bg-contain bg-no-repeat bg-center"
              style={{
                backgroundImage: 'url(/bg_professor_oaks_lab.png)',
              }}
            >
              <div className="w-[100%] flex flex-col items-center justify-center gap-20">
                <div>
                  <img src="/PokeBattles.png" alt="" width={500} height={500} />
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

// <div className="holderForBannerBubbles w-full h-[100px] pt-2 px-8 sm:px-1  flex  flex-wrap flex-row items-center justify-between font-mono text-sm ">
//   {/* SEEN */}
//   <div className="m-1 p-1 mx-4  flex  w-auto justify-center border-b border-blue-300 bg-gradient-to-b from-blue-200 pb-4 pt-4 backdrop-blur-2xl  rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//     {/* if dark d=mode use above: dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit */}
//     <div className="flex">
//       {loggedState ? (
//         <div className="flex items-center">
//           Seen: {seenNumber}/151
//         </div>
//       ) : (
//         <div className="flex gap-2 w-full">
//           <div> Pokemon Remastered</div>
//           <div className="hidden sm:flex">- Remade with Next.JS</div>
//         </div>
//       )}
//     </div>
//   </div>
//   {/* LOGGED IN */}
//   {isAuthenticated && (
//     <div className="m-1 p-1 mx-4  flex  w-auto justify-center border-b border-purple-300 bg-gradient-to-b from-purple-200 pb-4 pt-4 backdrop-blur-2xl  rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//       <div className="flex items-center">
//         <div className="flex items-center">User: {user?.email}</div>
//       </div>
//     </div>
//   )}

//   {/* CAUGHT */}
//   <div
//     className={`m-1 p-1 mx-4  ${loggedState ? "" : "invisible md:visible"} flex w-auto justify-center border-b border-red-300 bg-gradient-to-b from-red-200 pb-4 pt-4 backdrop-blur-2xl  rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30`}
//   >
//     {/* if dark d=mode use above:  dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit */}
//     {loggedState ? (
//       <div className=" flex items-center ">
//         Caught: {caughtNumber}/151
//       </div>
//     ) : (
//       <div className="flex gap-2 w-full">
//         <div> Hosted with</div>
//         <img src="/vercel.svg" alt="" width={100} height={24} />
//       </div>
//     )}
//   </div>
// </div>;
