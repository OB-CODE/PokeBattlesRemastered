import { create } from 'zustand';

interface InBattleStoreFlag {
  userIsInBattle: boolean;
  setUserIsInBattle: (inBattle: boolean) => void;
  battleOver: boolean;
  setBattleOver: (over: boolean) => void;
}

const userInBattleStoreFlag = create<InBattleStoreFlag>((set) => ({
  userIsInBattle: false,
  setUserIsInBattle: (inBattle: boolean) => set({ userIsInBattle: inBattle }),
  battleOver: false,
  setBattleOver: (over: boolean) => set({ battleOver: over }),
}));

export default userInBattleStoreFlag;
