import React from "react";
import { itemsStore } from "../../../store/itemsStore";
import { pokeballMapping } from "../../../store/relatedMappings/pokeBallMapping";
import Image from "next/image";
import { potionMapping } from "../../../store/relatedMappings/potionMapping";

const BackpackBody = () => {
  const moneyOwned = itemsStore((state) => state.moneyOwned);

  const pokeballsOwned = itemsStore((state) => state.pokeballsOwned);
  const goldenPokeballsOwned = itemsStore(
    (state) => state.goldenPokeballsOwned
  );
  const smallHealthPotionsOwned = itemsStore(
    (state) => state.smallHealthPotionsOwned
  );
  const largeHealthPotionsOwned = itemsStore(
    (state) => state.largeHealthPotionsOwned
  );

  interface IBackpackItems {
    name: string;
    owned: number;
    description: string | Function;
    logo: string;
  }

  let backpackItems: IBackpackItems[] = [
    {
      name: pokeballMapping.pokeball.name,
      owned: pokeballsOwned,
      description: pokeballMapping.pokeball.description,
      logo: pokeballMapping.pokeball.imgDes,
    },
    {
      name: pokeballMapping.goldenPokeball.name,
      owned: goldenPokeballsOwned,
      description: pokeballMapping.goldenPokeball.description,
      logo: pokeballMapping.goldenPokeball.imgDes,
    },
    {
      name: potionMapping.small.name,
      owned: smallHealthPotionsOwned,
      description: potionMapping.small.description,
      logo: potionMapping.small.imgDes,
    },
    {
      name: potionMapping.large.name,
      owned: largeHealthPotionsOwned,
      description: potionMapping.large.description,
      logo: potionMapping.large.imgDes,
    },
  ];

  return (
    <div className="flex w-full h-full justify-between flex-wrap">
      <div className="w-full bold text-lg border bg-yellow-200">
        Money: <span className="font-bold">${moneyOwned}</span>
      </div>
      {backpackItems.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col justify-between w-[46%] m-1 my-3 pb-6 bg-green-100 rounded-xl p-1"
          >
            <div>
              <div className="w-full flex justify-center py-1">
                <div className="w-full flex justify-center">
                  <div className="border rounded-3xl w-8 h-8 flex justify-center items-center bg-gray-200">
                    {item.owned}x
                  </div>
                  <div className="border rounded-3xl w-10 h-10 flex justify-center items-center bg-purple-300">
                    {item.logo != "X" ? (
                      <Image
                        src={`/${item.logo}`}
                        width={150}
                        height={150}
                        alt={item.name}
                      />
                    ) : (
                      item.logo
                    )}{" "}
                  </div>
                  <div className=" w-8 h-8"></div>
                </div>
              </div>

              <div className="font-bold">{item.name}</div>
              <div className="italic">
                {typeof item.description === "function"
                  ? item.description()
                  : item.description}
              </div>
            </div>

            <div className="flex justify-center w-full"></div>
          </div>
        );
      })}
    </div>
  );
};

export default BackpackBody;
