import { accountStatsStore } from './accountStatsStore';

describe('accountStatsStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    accountStatsStore.setState({
      totalBattles: 0,
      totalPokemonCaught: 0,
      totalPokemonSeen: 0,
      totalBattlesWon: 0,
      totalBattlesLost: 0,
      username: undefined,
    });
  });

  describe('default values', () => {
    test('starts with 0 total battles', () => {
      expect(accountStatsStore.getState().totalBattles).toBe(0);
    });

    test('starts with 0 pokemon caught', () => {
      expect(accountStatsStore.getState().totalPokemonCaught).toBe(0);
    });

    test('starts with 0 pokemon seen', () => {
      expect(accountStatsStore.getState().totalPokemonSeen).toBe(0);
    });

    test('starts with 0 battles won', () => {
      expect(accountStatsStore.getState().totalBattlesWon).toBe(0);
    });

    test('starts with 0 battles lost', () => {
      expect(accountStatsStore.getState().totalBattlesLost).toBe(0);
    });

    test('starts with undefined username', () => {
      expect(accountStatsStore.getState().username).toBeUndefined();
    });
  });

  describe('setters', () => {
    test('setTotalBattles updates total battles', () => {
      accountStatsStore.getState().setTotalBattles(10);
      expect(accountStatsStore.getState().totalBattles).toBe(10);
    });

    test('setTotalPokemonCaught updates caught count', () => {
      accountStatsStore.getState().setTotalPokemonCaught(25);
      expect(accountStatsStore.getState().totalPokemonCaught).toBe(25);
    });

    test('setTotalPokemonSeen updates seen count', () => {
      accountStatsStore.getState().setTotalPokemonSeen(50);
      expect(accountStatsStore.getState().totalPokemonSeen).toBe(50);
    });

    test('setTotalBattlesWon updates won count', () => {
      accountStatsStore.getState().setTotalBattlesWon(8);
      expect(accountStatsStore.getState().totalBattlesWon).toBe(8);
    });

    test('setTotalBattlesLost updates lost count', () => {
      accountStatsStore.getState().setTotalBattlesLost(3);
      expect(accountStatsStore.getState().totalBattlesLost).toBe(3);
    });

    test('setUsername updates username', () => {
      accountStatsStore.getState().setUsername('AshKetchum');
      expect(accountStatsStore.getState().username).toBe('AshKetchum');
    });

    test('multiple setters work independently', () => {
      accountStatsStore.getState().setTotalBattles(5);
      accountStatsStore.getState().setTotalBattlesWon(3);
      accountStatsStore.getState().setTotalBattlesLost(2);

      const state = accountStatsStore.getState();
      expect(state.totalBattles).toBe(5);
      expect(state.totalBattlesWon).toBe(3);
      expect(state.totalBattlesLost).toBe(2);
      // Other values remain at default
      expect(state.totalPokemonCaught).toBe(0);
      expect(state.totalPokemonSeen).toBe(0);
    });
  });
});
