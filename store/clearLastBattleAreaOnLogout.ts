import { useLastBattleAreaStore } from './lastBattleAreaStore';

export const clearLastBattleAreaOnLogout = () => {
  useLastBattleAreaStore.getState().clearLastArea();
};
