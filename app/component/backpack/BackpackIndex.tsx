import React from "react";
import { IbackpackInfo } from "../HealAndPokedex";
import Modal from "../../Modal";
import Image from "next/image";
import BackpackBody from "./BackpackBody";
import { backpackSCG } from "../../utils/UI/svgs";

const BackpackIndex = (backPackInfo: IbackpackInfo) => {
  const { showBackPack, setShowBackpack } = backPackInfo;
  return (
    <>
      {showBackPack ? (
        <Modal
          open={showBackPack}
          onClose={() => setShowBackpack(false)}
          content={{
            heading: `Your Belongings`,
            body: <BackpackBody />,
            closeMessage: "Stop rummaging",
            iconChoice: backpackSCG,
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default BackpackIndex;
