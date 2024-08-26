import React from "react";
import { constructionToast } from "../../../utils/helperfn";

const BattleActionButtons = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[40%] flex justify-around">
        <button
          onClick={constructionToast}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Attack
        </button>
        <button
          onClick={constructionToast}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Catch
        </button>
        <button
          onClick={constructionToast}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default BattleActionButtons;
