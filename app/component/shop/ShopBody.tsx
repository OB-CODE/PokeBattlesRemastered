import React from 'react';
import { itemsStore } from '../../../store/itemsStore';
import { toast } from 'react-toastify';
import { potionMapping } from '../../../store/relatedMappings/potionMapping';
import Image, { StaticImageData } from 'next/image';
import { pokeballMapping } from '../../../store/relatedMappings/pokeBallMapping';

interface IShopItem {
  name: string;
  cost: number;
  description: string | Function;
  logo: string | StaticImageData;
  buySingleAction: () => void;
  sellSingleAction: () => void;
  qty: number;
}

const ShopBody = () => {
  let moneyOwned = itemsStore((state) => state.moneyOwned);
  const decreaseMoneyOwned = itemsStore((state) => state.decreaseMoneyOwned);
  const increaseMoneyOwned = itemsStore((state) => state.increaseMoneyOwned);

  const pokeballsOwned = itemsStore((state) => state.pokeballsOwned);
  const increasePokeballsOwned = itemsStore(
    (state) => state.increasePokeballsOwned
  );
  const decreasePokeballsOwned = itemsStore(
    (state) => state.decreasePokeballsOwned
  );

  const goldenPokeballsOwned = itemsStore(
    (state) => state.goldenPokeballsOwned
  );
  const increaseGoldenPokeballsOwned = itemsStore(
    (state) => state.increaseGoldenPokeballsOwned
  );
  const decreaseGoldenPokeballsOwned = itemsStore(
    (state) => state.decreaseGoldenPokeballsOwned
  );

  const smallHealthPotionsOwned = itemsStore(
    (state) => state.smallHealthPotionsOwned
  );
  const increaseSmallHealthPotionsOwned = itemsStore(
    (state) => state.increaseSmallHealthPotionsOwned
  );
  const decreaseSmallHealthPotionsOwned = itemsStore(
    (state) => state.decreaseSmallHealthPotionsOwned
  );

  const largeHealthPotionsOwned = itemsStore(
    (state) => state.largeHealthPotionsOwned
  );
  const increaseLargeHealthPotionsOwned = itemsStore(
    (state) => state.increaseLargeHealthPotionsOwned
  );
  const decreaseLargeHealthPotionsOwned = itemsStore(
    (state) => state.decreaseLargeHealthPotionsOwned
  );

  const candyCanesOwned = itemsStore((state) => state.candyCanesOwned);
  const increaseCandyCanesOwned = itemsStore(
    (state) => state.increaseCandyCanesOwned
  );
  const decreaseCandyCanesOwned = itemsStore(
    (state) => state.decreaseCandyCanesOwned
  );

  const pokeballGlovesOwned = itemsStore((state) => state.pokeballGlovesOwned);
  const increasePokeballGlovesOwned = itemsStore(
    (state) => state.increasePokeballGlovesOwned
  );
  const decreasePokeballGlovesOwned = itemsStore(
    (state) => state.decreasePokeballGlovesOwned
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
      sellSingleAction: () => {
        decreasePokeballsOwned(1);
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
      sellSingleAction: () => {
        decreaseGoldenPokeballsOwned(1);
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
      sellSingleAction: () => {
        decreaseSmallHealthPotionsOwned(1);
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
      sellSingleAction: () => {
        decreaseLargeHealthPotionsOwned(1);
      },
      qty: largeHealthPotionsOwned,
    },
    {
      name: 'Candy Cane',
      cost: 200,
      description: 'Takes the Pokémon to the next level.',
      logo: 'candycane.png',
      buySingleAction: () => {
        increaseCandyCanesOwned(1);
      },
      sellSingleAction: () => {
        decreaseCandyCanesOwned(1);
      },
      qty: candyCanesOwned,
    },
    {
      name: 'Pokeball Glove',
      cost: 500,
      description:
        'Increases the chance of catching a Pokémon by 10% if owned.',
      logo: 'glove.png',
      buySingleAction: () => {
        increasePokeballGlovesOwned(1);
      },
      sellSingleAction: () => {
        decreasePokeballGlovesOwned(1);
      },
      qty: pokeballGlovesOwned,
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

  function attemptSale(item: IShopItem) {
    if (item.qty > 0) {
      // Calculate sale price (half the cost, rounded to nearest whole number)
      const salePrice = Math.round(item.cost / 2);
      increaseMoneyOwned(salePrice);
      item.sellSingleAction();
      toast.success(
        `You sold ${item.name} for $${salePrice}. You now have $${moneyOwned + salePrice} and ${item.qty - 1} ${item.name}(s) remaining.`
      );
    } else {
      toast.warn(`You don't have any ${item.name} to sell.`);
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
                  <div className="border rounded-3xl w-14 h-14 flex justify-center items-center bg-green-100">
                    {item.logo != 'X' ? (
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
                <div className="flex flex-col justify-center items-center">
                  <div className="border rounded-3xl w-8 h-8 flex justify-center items-center bg-yellow-400">
                    ${item.cost}
                  </div>
                  <div className="border rounded-3xl w-8 h-8 flex justify-center items-center bg-red-300">
                    ${item.cost / 2}
                  </div>
                </div>
              </div>

              <div className="font-bold">{item.name}</div>
              <div className="italic">
                {typeof item.description === 'function'
                  ? item.description()
                  : item.description}
              </div>
            </div>

            <div className="flex justify-between w-full px-2">
              <button
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
                onClick={() => attemptPurchase(item)}
              >
                Buy
              </button>
              <button
                className="text-black bg-red-300 hover:bg-red-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
                onClick={() => attemptSale(item)}
              >
                Sell
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopBody;
