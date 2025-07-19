// import React, { SetStateAction, useEffect, useState } from "react";
// import Pokedex from "./Pokedex";
// import PokemonParty from "./PokemonParty";
// import { IallBattleStateInfo } from "../GameMainPage";
// import HealIndex from "./Heal/HealIndex";
// import { backpackSCG, shopSVG } from "../utils/UI/svgs";
// import BackpackIndex from "./backpack/BackpackIndex";
// import ShopIndex from "./shop/ShopIndex";

// export interface IhealPokemonInfo {
//   showHealPokemon: boolean;
//   setShowHealPokemon: React.Dispatch<SetStateAction<boolean>>;
// }

// export interface IbackpackInfo {
//   showBackPack: boolean;
//   setShowBackpack: React.Dispatch<SetStateAction<boolean>>;
// }

// export interface IshopInfo {
//   showShop: boolean;
//   setShowShop: React.Dispatch<SetStateAction<boolean>>;
// }

// const HealAndPokedex = (allBattleStateInfo: IallBattleStateInfo) => {
//   const { playerPokemon, setPlayerPokemon } = allBattleStateInfo;
//   const [showPokedex, setShowPokedex] = useState<boolean>(false);
//   const [showHealPokemon, setShowHealPokemon] = useState(false);
//   const [showBackPack, setShowBackpack] = useState(false);
//   const [showShop, setShowShop] = useState(false);

//   const healPokemonInfo = {
//     showHealPokemon,
//     setShowHealPokemon,
//   };

//   const backPackInfo: IbackpackInfo = { showBackPack, setShowBackpack };

//   const shopInfo: IshopInfo = {
//     showShop,
//     setShowShop,
//   };

//   const [bgColourToGoBack, setBgColourToGoBack] = useState("bg-slate-200");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBgColourToGoBack((prev) =>
//         prev === "bg-slate-200" ? "bg-slate-300" : "bg-slate-200"
//       );
//     }, 300); // change every 300ms for visible flashing

//     return () => clearInterval(interval); // cleanup on unmount
//   }, []);

//   return (
//     <div className="flex flex-col w-full h-[calc(100%-60px)] items-center justify-start">
//       <div className="flex justify-between w-[90%] mt-3">
//         <div className="flex sm:flex-row gap-3 flex-col">
//           <button
//             onClick={() => setShowHealPokemon(true)}
//             className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
//           >
//             Heal Pokemon
//           </button>
//           <button
//             onClick={() => setShowShop(true)}
//             className="text-black bg-blue-300 hover:bg-blue-400 w-10  border-2 border-black rounded-xl"
//           >
//             <div className="flex justify-center items-center h-10">
//               {shopSVG}
//             </div>
//           </button>
//         </div>
//         <div className="flex sm:flex-row gap-3 flex-col-reverse justify-end">
//           <div className="flex justify-end">
//             <button
//               onClick={() => setShowBackpack(true)}
//               className="text-black bg-blue-300 hover:bg-blue-400 w-10  border-2 border-black rounded-xl"
//             >
//               <div className="flex w-full justify-center  items-center h-10">
//                 {backpackSCG}
//               </div>
//             </button>
//           </div>
//           <div
//             className={`${showPokedex ? `${bgColourToGoBack} rounded-xl pb-2 pl-2` : ""}`}
//           >
//             <button
//               className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
//               onClick={() => setShowPokedex(!showPokedex)}
//             >
//               {showPokedex ? "POKEMON PARTY" : "POKEDEX"}
//             </button>
//           </div>
//         </div>
//       </div>
//       {showPokedex ? <Pokedex /> : <PokemonParty {...allBattleStateInfo} />}

//       <HealIndex {...healPokemonInfo} />
//       <BackpackIndex {...backPackInfo} />
//       <ShopIndex {...shopInfo} />
//     </div>
//   );
// };

// export default HealAndPokedex;
