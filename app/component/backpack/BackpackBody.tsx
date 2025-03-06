import React from "react";

const BackpackBody = () => {
  let backpackItems = [
    {
      name: "Pokeball",
      owned: 5,
      description: "A basic pokeball",
      logo: "X",
    },
    {
      name: "Golden Pokeball",
      owned: 1,
      description: "15% extra chance to catch a pokemon.",
      logo: "X",
    },
    {
      name: "Small health potion",
      owned: 3,
      description: "Heals 20 health.",
      logo: "X",
    },
    {
      name: "large health potion",
      owned: 1,
      description: "Heals 60 health.",
      logo: "?",
    },
  ];

  return (
    <div className="flex w-full h-full justify-between flex-wrap">
      {backpackItems.map((item) => {
        return (
          <div className="flex flex-col justify-between w-[46%] m-1 my-3 pb-6 bg-green-100 rounded-xl p-1">
            <div>
              <div className="w-full flex justify-center py-1">
                <div className="w-full flex justify-center">
                  <div className="border rounded-3xl w-8 h-8 flex justify-center items-center bg-gray-200">
                    {item.owned}x
                  </div>
                  <div className="border rounded-3xl w-10 h-10 flex justify-center items-center bg-purple-300">
                    {item.logo}
                  </div>
                  <div className=" w-8 h-8"></div>
                </div>
              </div>

              <div className="font-bold">{item.name}</div>
              <div className="italic">{item.description}</div>
            </div>

            <div className="flex justify-center w-full"></div>
          </div>
        );
      })}
    </div>
  );
};

export default BackpackBody;
