import React from "react";
import { itemsStore } from "../../../store/itemsStore";
import { toast } from "react-toastify";
import { potionMapping } from "../../../store/relatedMappings/potionMapping";
import Image, { StaticImageData } from "next/image";
import { pokeballMapping } from "../../../store/relatedMappings/pokeBallMapping";

interface IShopItem {
  name: string;
  cost: number;
  description: string | Function;
  logo: string | StaticImageData;
  buySingleAction: () => void;
  qty: number;
}

const ShopBody = () => {
  let moneyOwned = itemsStore((state) => state.moneyOwned);
  const decreaseMoneyOwned = itemsStore((state) => state.decreaseMoneyOwned);

  const pokeballsOwned = itemsStore((state) => state.pokeballsOwned);
  const increasePokeballsOwned = itemsStore(
    (state) => state.increasePokeballsOwned
  );

  const goldenPokeballsOwned = itemsStore(
    (state) => state.goldenPokeballsOwned
  );
  const increaseGoldenPokeballsOwned = itemsStore(
    (state) => state.increaseGoldenPokeballsOwned
  );
  const smallHealthPotionsOwned = itemsStore(
    (state) => state.smallHealthPotionsOwned
  );
  const increaseSmallHealthPotionsOwned = itemsStore(
    (state) => state.increaseSmallHealthPotionsOwned
  );
  const largeHealthPotionsOwned = itemsStore(
    (state) => state.largeHealthPotionsOwned
  );
  const increaseLargeHealthPotionsOwned = itemsStore(
    (state) => state.increaseLargeHealthPotionsOwned
  );

  let shopItems: IShopItem[] = [
    {
      name: pokeballMapping.pokeball.name,
      cost: pokeballMapping.pokeball.cost,
      description: pokeballMapping.pokeball.description,
      logo: pokeballMapping.pokeball.imgDes,
      buySingleAction: () => {
        increasePokeballsOwned(1);
      },
      qty: pokeballsOwned,
    },
    {
      name: pokeballMapping.goldenPokeball.name,
      cost: pokeballMapping.goldenPokeball.cost,
      description: pokeballMapping.goldenPokeball.description,
      logo: pokeballMapping.goldenPokeball.imgDes,
      buySingleAction: () => {
        increaseGoldenPokeballsOwned(1);
      },
      qty: goldenPokeballsOwned,
    },
    {
      name: potionMapping.small.name,
      cost: potionMapping.small.cost,
      description: potionMapping.small.description,
      logo: potionMapping.small.imgDes,
      buySingleAction: () => {
        increaseSmallHealthPotionsOwned(1);
      },
      qty: smallHealthPotionsOwned,
    },
    {
      name: potionMapping.large.name,
      cost: potionMapping.large.cost,
      description: potionMapping.large.description,
      logo: potionMapping.large.imgDes,
      buySingleAction: () => {
        increaseLargeHealthPotionsOwned(1);
      },
      qty: largeHealthPotionsOwned,
    },
  ];

  function attemptPurchase(item: IShopItem) {
    if (moneyOwned >= item.cost) {
      decreaseMoneyOwned(item.cost);
      toast.success(
        `You bought ${item.name} for $${item.cost}. You have $${moneyOwned - item.cost} left. You now have ${item.qty + 1} ${item.name}(s).`
      );
      // increase item count
      item.buySingleAction();
    } else {
      toast.warn(
        `Not enough money to buy ${item.name}. You have $${moneyOwned} remaining.`
      );
    }
  }

  return (
    <div className="flex w-full h-full justify-between flex-wrap">
      <div className="w-full bold text-lg border bg-yellow-200">
        Your Money: <span className="font-bold">${moneyOwned}</span>
      </div>

      {shopItems.map((item: IShopItem, index) => {
        return (
          <div
            key={index}
            className="flex flex-col justify-between w-[46%] m-1 my-3 bg-purple-100 rounded-xl p-1"
          >
            <div>
              <div className="flex mb-1S pl-1">Owned: {item.qty}</div>
              <div className="w-full flex justify-between py-1">
                <div className="w-full flex justify-center pl-8">
                  <div className="border rounded-3xl w-10 h-10 flex justify-center items-center bg-green-100">
                    {item.logo != "X" ? (
                      <Image
                        src={`/${item.logo}`}
                        width={150}
                        height={150}
                        alt="pokeBall"
                      />
                    ) : (
                      item.logo
                    )}
                  </div>
                </div>

                <div className="border rounded-3xl w-8 h-8 flex justify-center items-center bg-yellow-400">
                  ${item.cost}
                </div>
              </div>

              <div className="font-bold">{item.name}</div>
              <div className="italic">
                {typeof item.description === "function"
                  ? item.description()
                  : item.description}
              </div>
            </div>

            <div className="flex justify-center w-full">
              <button
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
                onClick={() => attemptPurchase(item)}
              >
                Buy
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopBody;
