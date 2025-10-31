import { api } from '../utils/apiCallsNext';
import accountStatsStore from '../../store/accountStatsStore';

export const battleService = {
  // if no userId, assume guest user and just update store
  incrementTotalBattles: async (userId?: string) => {
    const totalBattles = accountStatsStore.getState().totalBattles;
    const newTotalBattles = totalBattles + 1;

    if (userId) {
      // Update both DB and store (api call will update store)
      await api
        .updateUserAccountStats(userId, 'totalBattles', newTotalBattles)
        .catch((error) =>
          console.error('Failed to update battle stats:', error)
        );
      accountStatsStore.getState().setTotalBattles(newTotalBattles);
    } else {
      // Just update store for guest users
      accountStatsStore.getState().setTotalBattles(newTotalBattles);
    }

    return newTotalBattles;
  },
  // - incrementBattlesWon
  incrementBattlesWon: async (userId?: string) => {
    const totalBattlesWon = accountStatsStore.getState().totalBattlesWon;
    const newTotalBattlesWon = totalBattlesWon + 1;
    if (userId) {
      // Update both DB and store (api call will update store)
      await api
        .updateUserAccountStats(userId, 'totalBattlesWon', newTotalBattlesWon)
        .catch((error) =>
          console.error('Failed to update battles won:', error)
        );
      accountStatsStore.getState().setTotalBattlesWon(newTotalBattlesWon);
    } else {
      // Just update store for guest users
      accountStatsStore.getState().setTotalBattlesWon(newTotalBattlesWon);
    }
    return newTotalBattlesWon;
  },
  // - incrementBattlesLost
  incrementBattlesLost: async (userId?: string) => {
    const totalBattlesLost = accountStatsStore.getState().totalBattlesLost;
    const newTotalBattlesLost = totalBattlesLost + 1;
    if (userId) {
      // Update both DB and store (api call will update store)
      await api
        .updateUserAccountStats(userId, 'totalBattlesLost', newTotalBattlesLost)
        .catch((error) =>
          console.error('Failed to update battles lost:', error)
        );
      accountStatsStore.getState().setTotalBattlesLost(newTotalBattlesLost);
    } else {
      // Just update store for guest users
      accountStatsStore.getState().setTotalBattlesLost(newTotalBattlesLost);
    }
    return newTotalBattlesLost;
  },
  // - calculateRewards
  // etc.
};
