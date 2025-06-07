import Image from "next/image";
import React from "react";
import { constructionToast } from "../../utils/helperfn";

const HealBody = () => {
  let introHealMessgae =
    "I can heal your pokemon for you. It will cost $1 for every HP they are missing to cover the supplies. ";

  return (
    <div>
      <div>{introHealMessgae}</div>
      <div className="py-4  flex justify-center">
        <div className="flex justify-between w-[70%]">
          <div>Total Cost:</div>
          <div>???</div>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={() => constructionToast}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Heal Pokemon
        </button>
      </div>
      <Image
        src={"/pokeCenter.jpg"}
        width={600}
        height={600}
        alt="Trainer back and backpack"
      />
    </div>
  );
};

export default HealBody;
