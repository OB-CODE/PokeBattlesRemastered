import React from "react";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";

const GameOver = () => {
  const numberOfCaughtPokemon = userPokemonDetailsStore(
    (state) => state.userPokemonData.filter((p) => p.caught).length
  );

  return (
    <div className="flex flex-col items-center justify-end h-full w-full gap-2">
      <div className="font-italic  text-3xl">
        Beat the game by catching all 151 Pokemon!
      </div>
      <div className="font-italic font-thin text-3xl">
        You have caught
        <span className="font-bold"> {numberOfCaughtPokemon} / 151</span>{" "}
        Pokemon.
      </div>
    </div>
  );
};

export default GameOver;

//           </div>
//           <div></div>
//       GameOver
//     </div>
//   );
// };

// export default GameOver;
