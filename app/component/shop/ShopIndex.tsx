import React from "react";
import { IshopInfo } from "../HealAndPokedex";
import Modal from "../../Modal";
import ShopBody from "./ShopBody";
import { shopSVG } from "../../utils/UI/svgs";

const ShopIndex = (shopInfo: IshopInfo) => {
  const { showShop, setShowShop } = shopInfo;
  return (
    <>
      {showShop ? (
        <Modal
          open={showShop}
          onClose={() => setShowShop(false)}
          content={{
            heading: `Welcome to the Pokestore`,
            body: <ShopBody />,
            closeMessage: "Leave shop",
            iconChoice: shopSVG,
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ShopIndex;
