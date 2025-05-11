import React from "react";
import { itemsStore } from "../../../store/itemsStore";
import { toast } from "react-toastify";

const ShopBody = () => {
  let moneyOwned = itemsStore((state) => state.moneyOwned);
  const decreaseMoneyOwned = itemsStore((state) => state.decreaseMoneyOwned);

  let shopItems = [
    {
      name: "Pokeball",
      cost: 10,
      description: "A basic pokeball",
      logo: "X",
    },
    {
      name: "Golden Pokeball",
      cost: 30,
      description: "15% extra chance to catch a pokemon.",
      logo: "X",
    },
    {
      name: "Small health potion",
      cost: 20,
      description: "Heals 20 health.",
      logo: "X",
    },
    {
      name: "large health potion",
      cost: 40,
      description: "Heals 60 health.",
      logo: "?",
    },
  ];

  function attemptPurchase(item: {
    name: string;
    cost: number;
    description: string;
    logo: string;
  }) {
    if (moneyOwned >= item.cost) {
      decreaseMoneyOwned(item.cost);
      toast.success(
        `You bought ${item.name} for $${item.cost}. You have $${moneyOwned - item.cost} left.`
      );
    } else {
      toast.warn(
        `Not enough money to buy ${item.name}. You have $${moneyOwned} remaining.`
      );
    }
  }

  return (
    <div className="flex w-full h-full justify-between flex-wrap">
      <div className="w-full">Money: {moneyOwned}</div>

      {shopItems.map((item) => {
        return (
          <div className="flex flex-col justify-between w-[46%] m-1 my-3 bg-purple-100 rounded-xl p-1">
            <div>
              <div className="w-full flex justify-between py-1">
                <div className="w-full flex justify-center pl-8">
                  <div className="border rounded-3xl w-10 h-10 flex justify-center items-center bg-green-100">
                    {item.logo}
                  </div>
                </div>

                <div className="border rounded-3xl w-8 h-8 flex justify-center items-center bg-yellow-400">
                  ${item.cost}
                </div>
              </div>

              <div className="font-bold">{item.name}</div>
              <div className="italic">{item.description}</div>
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
