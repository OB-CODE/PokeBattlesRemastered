import React, { useEffect, useState } from 'react';
import { itemsStore } from '../store/itemsStore';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from './utils/apiCallsNext';

interface StoreItem {
  quantity: number;
  lastUpdated: Date;
  user_id: string;
  item_id:
  | 'moneyOwned'
  | 'pokeballsOwned'
  | 'goldenPokeballsOwned'
  | 'smallHealthPotionsOwned'
  | 'largeHealthPotionsOwned';
}

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
    // Perform the initial fetch to retrieve user items
    const fetchUserItems = async () => {
      if (!user || !user.sub) return;

      try {
        const response = await api.getUserItems(user.sub);
        // Set the items in the zustand store]
        if (response) {
          itemsStore.getState().setUserItems({
            moneyOwned: response.moneyOwned ?? 0,
            pokeballsOwned: response.pokeballsOwned ?? 0,
            goldenPokeballsOwned: response.goldenPokeballsOwned ?? 0,
            smallHealthPotionsOwned: response.smallHealthPotionsOwned ?? 0,
            largeHealthPotionsOwned: response.largeHealthPotionsOwned ?? 0,
            candyCanesOwned: response.candyCanesOwned ?? 0,
            pokeballGlovesOwned: response.pokeballGlovesOwned ?? 0
          });
        }
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    };
    fetchUserItems();
    setHasRetrievedItems(true);
  }, []);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(user.sub, 'moneyOwned', storeMoney);
  }, [storeMoney]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(user.sub, 'pokeballsOwned', storePokeBalls);
  }, [storePokeBalls]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(user.sub, 'goldenPokeballsOwned', storeGoldenPokeballs);
  }, [storeGoldenPokeballs]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(
      user.sub,
      'smallHealthPotionsOwned',
      storeSmallHealthPotiens
    );
  }, [storeSmallHealthPotiens]);

  React.useEffect(() => {
    // Check if this captures ALL items changing in the store.
    if (!user || !user.sub) return;
    if (!hasRetrievedItems) return;
    api.updateUserItems(
      user.sub,
      'largeHealthPotionsOwned',
      storeLargeHealthPotiens
    );
  }, [storeLargeHealthPotiens]);

  return null;
};

export default ItemUpdateTrigger;
