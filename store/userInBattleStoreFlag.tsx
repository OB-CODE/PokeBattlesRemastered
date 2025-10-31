import { create } from 'zustand';

interface InBattleStoreFlag {
  userIsInBattle: boolean;
  setUserIsInBattle: (inBattle: boolean) => void;
}

const userInBattleStoreFlag = create<InBattleStoreFlag>((set) => ({
  userIsInBattle: false,
  setUserIsInBattle: (inBattle: boolean) => set({ userIsInBattle: inBattle }),
}));

export default userInBattleStoreFlag;
