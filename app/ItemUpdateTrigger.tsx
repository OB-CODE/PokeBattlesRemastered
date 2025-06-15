import React, { useEffect, useState } from "react";
import { itemsStore } from "../store/itemsStore";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "./utils/apiCallsNext";

const ItemUpdateTrigger = () => {
  const { user } = useAuth0();

  const storeMoney = itemsStore((state) => state.moneyOwned);
  const storePokeBalls = itemsStore((state) => state.pokeballsOwned);
  const storeGoldenPokeballs = itemsStore(
    (state) => state.goldenPokeballsOwned
  );
  const storeSmallHealthPotiens = itemsStore(
    (state) => state.smallHealthPotionsOwned
  );
  const storeLargeHealthPotiens = itemsStore(
    (state) => state.largeHealthPotionsOwned
  );

  const [hasRetrievedItems, setHasRetrievedItems] = useState(false);
  useEffect(() => {
    setHasRetrievedItems(true);
  }, []);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(user.sub, "moneyOwned", storeMoney);
  }, [storeMoney]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(user.sub, "pokeballsOwned", storePokeBalls);
  }, [storePokeBalls]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(user.sub, "goldenPokeballsOwned", storeGoldenPokeballs);
  }, [storeGoldenPokeballs]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(
      user.sub,
      "smallHealthPotionsOwned",
      storeSmallHealthPotiens
    );
  }, [storeSmallHealthPotiens]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(
      user.sub,
      "largeHealthPotionsOwned",
      storeLargeHealthPotiens
    );
  }, [storeLargeHealthPotiens]);

  return null;
};

export default ItemUpdateTrigger;
