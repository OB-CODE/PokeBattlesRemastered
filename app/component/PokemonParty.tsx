import React from "react";
import { constructionToast } from "../utils/helperfn";
import { Caprasimo } from "next/font/google";

const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

const PokemonParty = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className={`${CaprasimoFont.className} text-4xl pb-8`}>
        Pokemon Party
      </div>
      <div className="w-[95%] h-full flex flex-wrap justify-center">
        <div className="w-[80%]  md:w-[33%] lg:w-[20%] h-[40%]">
          <div className="flex justify-center items-center bg-gray-300 w-full h-full">
            <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-gray-100">
              <div className="pb-3">PokeName</div>
              <div className="h-[50%] w-[90%] bg-white">image</div>
              <div className="w-[80%] ">
                <div>HP:</div>
                <div>Attack:</div>
                <div>Defence:</div>
                <div>Speed:</div>
              </div>
            </div>
          </div>
          <div id="underCardButtonGroup" className="flex justify-around">
            <button
              onClick={constructionToast}
              className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            >
              View
            </button>
            <button
              onClick={constructionToast}
              className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            >
              Battle
            </button>
            <button
              onClick={constructionToast}
              className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            >
              Unselect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonParty;
