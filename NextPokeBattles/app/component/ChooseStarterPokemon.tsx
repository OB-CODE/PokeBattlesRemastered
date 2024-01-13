"use client";
import { log } from "console";
import React from "react";
import { useState } from "react";

const ChooseStarterPokemon = () => {
  const [isHoveredBulbasaur, setIsHoveredBulbasaur] = useState(false);
  const [isHoveredCharmander, setIsHoveredCharmander] = useState(false);
  const [isHoveredSquirtle, setIsHoveredSquirtle] = useState(false);



  function buttonCheck() {
    console.log("working");
  }
  function buttonCheckHover() {
    console.log("working on Hover");
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div>Choose Starter Pokemon</div>
      <div
        className="h-[70%] w-[90%] bg-contain bg-no-repeat bg-center"
        style={{
          backgroundImage: "url(/bg_professor_oaks_lab.png)",
        }}
      >
        <div className="h-full w-full flex justify-center items-center pt-5 md:pt-12 ">
          <div className="w-[75%] max-w-[800px] ml-2 md:ml-4 flex justify-between items-center">
            <div
              className="w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%]"
              style={{
                backgroundImage: isHoveredBulbasaur
                  ? "url(/selected_bulbasaur.png)"
                  : "url(/pokeball_close.png)",
                transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
              }}
              onMouseEnter={() => {
                setIsHoveredBulbasaur(true)
              }}
              onMouseLeave={() => setIsHoveredBulbasaur(false)}
            ></div>
            <div
              onClick={buttonCheck}
              onMouseOver={buttonCheckHover}
              className="md:ml-4 w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%]"
              style={{
                backgroundImage: isHoveredCharmander
                  ? "url(/selected_charmander.png)"
                  : "url(/pokeball_close.png)",
                transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
              }}
              onMouseEnter={() => {
                setIsHoveredCharmander(true)
              }}
              onMouseLeave={() => setIsHoveredCharmander(false)}            ></div>
            <div
              onClick={buttonCheck}
              onMouseOver={buttonCheckHover}
              className="w-[30%] min-h-[10] h-[200px] lg:h-[200px] bg-contain bg-no-repeat bg-center hover:h-[400px] hover:w-[35%]"
              style={{
                backgroundImage: isHoveredSquirtle
                  ? "url(/selected_squirtle.png)"
                  : "url(/pokeball_close.png)",
                transition: "background-image 0.3s ease-in-out", // Optional: Add a smooth transition
              }}
              onMouseEnter={() => {
                setIsHoveredSquirtle(true)
              }}
              onMouseLeave={() => setIsHoveredSquirtle(false)}            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseStarterPokemon;
