import React from "react";

const BattleActionButtons = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[40%] flex justify-around">
        <div className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl">
          Attack
        </div>
        <div className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl">
          Catch
        </div>
        <div className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl">
          Run
        </div>
      </div>
    </div>
  );
};

export default BattleActionButtons;
