import React from "react";

const ShopBody = () => {
  let shopItems = [
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

  return (
    <div className="flex w-full justify-between   ">
      {shopItems.map((item) => {
        return (
          <div className="flex flex-col w-[48%] bg-purple-100 rounded-xl p-1">
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
        );
      })}
    </div>
  );
};

export default ShopBody;
