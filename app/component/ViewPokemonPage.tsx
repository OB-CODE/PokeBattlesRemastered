import React from "react";
import { IPokemonForBattle } from "./PokemonParty";

interface IViewPokemonPage {
  selectedPokemonAtClick: IPokemonForBattle | undefined;
}

export const ViewPokemonPage: React.FC<IViewPokemonPage> = ({
  selectedPokemonAtClick,
}) => {
  return (
    <div className="flex justify-center items-center bg-gray-300 w-full h-full py-2">
      {selectedPokemonAtClick ? (
        <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-gray-100">
          <div className="pb-3 capitalize">{selectedPokemonAtClick.name}</div>
          <div className="flex justify-start w-full">NickName: </div>
          <div className="h-[100%] w-[90%] bg-white flex justify-center">
            <img src={selectedPokemonAtClick.img} alt="" />
          </div>
          <div className="w-[80%] ">
            <div>
              HP:{" "}
              <span className="font-bold">
                {/* TODO: Change to a remaining HP */}
                {selectedPokemonAtClick.hp.toString()}
              </span>
              /
              <span className="font-bold">
                {selectedPokemonAtClick.hp.toString()}
              </span>
            </div>
            <div>
              Attack:{" "}
              <span className="font-bold">
                {selectedPokemonAtClick.attack.toString()}
              </span>
            </div>
            <div>
              Defence:{" "}
              <span className="font-bold">
                {selectedPokemonAtClick.defense.toString()}
              </span>
            </div>
            <div>
              Speed:{" "}
              <span className="font-bold">
                {selectedPokemonAtClick.speed.toString()}
              </span>
            </div>
            <div>
              Battles fought: <span className="font-bold">{"Stats N/A"}</span>
            </div>
            <div>
              Battles won: <span className="font-bold">{"Stats N/A"}</span>
            </div>
            <div>
              Battles lost: <span className="font-bold">{"Stats N/A"}</span>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
