import accountStatsStore from './accountStatsStore';
import {
  beginGuestSession,
  clearGuestSave,
  endGuestSession,
  GUEST_SAVE_KEY,
  loadGuestSave,
  restoreGuestProgress,
  saveGuestProgress,
} from './guestSave';
import { itemsStore } from './itemsStore';
import useScoreSystem from './scoringSystem';
import { loggedStore } from './userLogged';
import userPokemonDetailsStore, {
  IUserPokemonData,
} from './userPokemonDetailsStore';

const pokemon = (overrides: Partial<IUserPokemonData>): IUserPokemonData => ({
  pokedex_number: 1,
  user_id: 0,
  nickname: '',
  seen: false,
  caught: false,
  level: 1,
  experience: 0,
  orderSeen: 0,
  orderCaught: 0,
  battlesFought: 0,
  battlesWon: 0,
  battlesLost: 0,
  remainingHp: 40,
  inParty: false,
  active: true,
  evolutions: 0,
  acquisitionMethod: 'caughtInWild',
  ...overrides,
});

const startingItems = {
  moneyOwned: 50,
  pokeballsOwned: 2,
  goldenPokeballsOwned: 0,
  smallHealthPotionsOwned: 5,
  largeHealthPotionsOwned: 0,
  candyCanesOwned: 3,
  pokeballGlovesOwned: 0,
};

function resetStores() {
  userPokemonDetailsStore.getState().setUserPokemonData([]);
  itemsStore.getState().setUserItems(startingItems);
  accountStatsStore.getState().setTotalBattles(0);
  accountStatsStore.getState().setTotalBattlesWon(0);
  useScoreSystem.getState().startNewGameScoringZustand();
  loggedStore.setState({ loggedIn: false, hasPokemon: false });
}

describe('guest save', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStores();
  });

  afterEach(() => {
    endGuestSession();
    jest.useRealTimers();
  });

  test('there is no save before a starter has been caught', () => {
    userPokemonDetailsStore
      .getState()
      .setUserPokemonData([pokemon({ pokedex_number: 1, seen: true })]);
    saveGuestProgress();
    expect(loadGuestSave()).toBeNull();
  });

  test('a saved game comes back exactly after everything is reset', () => {
    userPokemonDetailsStore.getState().setUserPokemonData([
      pokemon({
        pokedex_number: 7,
        caught: true,
        seen: true,
        level: 4,
        remainingHp: 12,
        inParty: true,
        nickname: 'Shelly',
      }),
      pokemon({ pokedex_number: 10, seen: true }),
    ]);
    itemsStore
      .getState()
      .setUserItems({ ...startingItems, moneyOwned: 137, pokeballsOwned: 0 });
    accountStatsStore.getState().setTotalBattles(9);
    accountStatsStore.getState().setTotalBattlesWon(6);
    accountStatsStore.getState().setUsername('Tester');
    useScoreSystem.getState().addScore(250, 'test');

    saveGuestProgress();
    resetStores();
    expect(itemsStore.getState().moneyOwned).toBe(50);

    const save = loadGuestSave();
    expect(save).not.toBeNull();
    restoreGuestProgress(save!);

    const starter = userPokemonDetailsStore
      .getState()
      .userPokemonData.find((p) => p.pokedex_number === 7)!;
    expect(starter).toMatchObject({
      caught: true,
      level: 4,
      remainingHp: 12,
      nickname: 'Shelly',
    });
    expect(itemsStore.getState().moneyOwned).toBe(137);
    expect(itemsStore.getState().pokeballsOwned).toBe(0);
    expect(accountStatsStore.getState().totalBattles).toBe(9);
    expect(accountStatsStore.getState().totalBattlesWon).toBe(6);
    expect(accountStatsStore.getState().username).toBe('Tester');
    expect(useScoreSystem.getState().totalScore).toBe(250);
  });

  test('clearing removes the save', () => {
    userPokemonDetailsStore
      .getState()
      .setUserPokemonData([pokemon({ caught: true })]);
    saveGuestProgress();
    clearGuestSave();
    expect(loadGuestSave()).toBeNull();
  });

  test('a corrupt or out-of-date save is ignored rather than crashing', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(GUEST_SAVE_KEY, '{not json');
    expect(loadGuestSave()).toBeNull();
    errorSpy.mockRestore();

    localStorage.setItem(GUEST_SAVE_KEY, JSON.stringify({ version: 999 }));
    expect(loadGuestSave()).toBeNull();
  });

  test('a guest session saves automatically when the game changes', () => {
    jest.useFakeTimers();
    userPokemonDetailsStore
      .getState()
      .setUserPokemonData([pokemon({ pokedex_number: 4, caught: true })]);
    loggedStore.setState({ loggedIn: true, hasPokemon: true });

    beginGuestSession();
    itemsStore.getState().increaseMoneyOwned(25);
    expect(loadGuestSave()).toBeNull(); // waits for a pause before writing

    jest.advanceTimersByTime(400);
    expect(loadGuestSave()?.items.moneyOwned).toBe(75);
  });

  test('nothing is saved automatically until a guest session has begun', () => {
    jest.useFakeTimers();
    userPokemonDetailsStore
      .getState()
      .setUserPokemonData([pokemon({ caught: true })]);
    loggedStore.setState({ loggedIn: true, hasPokemon: true });

    itemsStore.getState().increaseMoneyOwned(25);
    jest.advanceTimersByTime(400);
    expect(loadGuestSave()).toBeNull();
  });
});
