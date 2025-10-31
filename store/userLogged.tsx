import { create } from 'zustand';

interface ILoggedStoreState {
  loggedIn: boolean;
  hasPokemon: boolean;
  changeLoggedState: () => void;
  toggleHasFirstPokemon: () => void;
}

export const loggedStore = create<ILoggedStoreState>((set, get) => ({
  loggedIn: false,
  hasPokemon: false,
  changeLoggedState: () => set({ loggedIn: !get().loggedIn }),
  toggleHasFirstPokemon: () => set({ hasPokemon: !get().hasPokemon }),
}));
