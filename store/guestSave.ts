// Saves a guest's game in this browser so a refresh (or coming back later)
// doesn't wipe their progress. Logged-in players are saved in the database
// instead and never touch this.
import accountStatsStore from './accountStatsStore';
import { itemsStore } from './itemsStore';
import useScoreSystem from './scoringSystem';
import { loggedStore } from './userLogged';
import userPokemonDetailsStore, {
  IUserPokemonData,
} from './userPokemonDetailsStore';

export const GUEST_SAVE_KEY = 'pokebattles-guest-save';
const GUEST_SAVE_VERSION = 1;

export interface IGuestSave {
  version: number;
  savedAt: string;
  userPokemonData: IUserPokemonData[];
  items: {
    moneyOwned: number;
    pokeballsOwned: number;
    goldenPokeballsOwned: number;
    smallHealthPotionsOwned: number;
    largeHealthPotionsOwned: number;
    candyCanesOwned: number;
    pokeballGlovesOwned: number;
  };
  stats: {
    totalBattles: number;
    totalBattlesWon: number;
    totalBattlesLost: number;
    totalPokemonCaught: number;
    totalPokemonSeen: number;
    username?: string;
  };
  score: {
    totalScore: number;
    scoreHistory: unknown[];
    locationWins: Record<number, boolean>;
    previousMilestones: Record<string, boolean>;
  };
}

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    // Private browsing or blocked storage - the game still works, unsaved.
    return null;
  }
}

function buildSnapshot(): IGuestSave {
  const items = itemsStore.getState();
  const stats = accountStatsStore.getState();
  const score = useScoreSystem.getState();

  return {
    version: GUEST_SAVE_VERSION,
    savedAt: new Date().toISOString(),
    userPokemonData: userPokemonDetailsStore.getState().userPokemonData,
    items: {
      moneyOwned: items.moneyOwned,
      pokeballsOwned: items.pokeballsOwned,
      goldenPokeballsOwned: items.goldenPokeballsOwned,
      smallHealthPotionsOwned: items.smallHealthPotionsOwned,
      largeHealthPotionsOwned: items.largeHealthPotionsOwned,
      candyCanesOwned: items.candyCanesOwned,
      pokeballGlovesOwned: items.pokeballGlovesOwned,
    },
    stats: {
      totalBattles: stats.totalBattles,
      totalBattlesWon: stats.totalBattlesWon,
      totalBattlesLost: stats.totalBattlesLost,
      totalPokemonCaught: stats.totalPokemonCaught,
      totalPokemonSeen: stats.totalPokemonSeen,
      username: stats.username,
    },
    score: {
      totalScore: score.totalScore,
      scoreHistory: score.scoreHistory,
      locationWins: score.locationWins,
      previousMilestones: score.previousMilestones,
    },
  };
}

/** Write the current game to this browser. Only saves once a starter is chosen. */
export function saveGuestProgress(): void {
  const store = storage();
  if (!store) return;

  const snapshot = buildSnapshot();
  if (!snapshot.userPokemonData.some((pokemon) => pokemon.caught)) return;

  try {
    store.setItem(GUEST_SAVE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.error('Could not save guest progress:', error);
  }
}

/** Read the saved guest game, or null if there isn't a usable one. */
export function loadGuestSave(): IGuestSave | null {
  const store = storage();
  if (!store) return null;

  try {
    const raw = store.getItem(GUEST_SAVE_KEY);
    if (!raw) return null;

    const save = JSON.parse(raw) as IGuestSave;
    const usable =
      save &&
      save.version === GUEST_SAVE_VERSION &&
      Array.isArray(save.userPokemonData) &&
      save.userPokemonData.some((pokemon) => pokemon.caught) &&
      save.items &&
      save.stats;

    return usable ? save : null;
  } catch (error) {
    console.error('Could not read guest progress:', error);
    return null;
  }
}

export function clearGuestSave(): void {
  try {
    storage()?.removeItem(GUEST_SAVE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

/** Put a saved guest game back into the game's stores. */
export function restoreGuestProgress(save: IGuestSave): void {
  userPokemonDetailsStore.getState().setUserPokemonData(save.userPokemonData);
  itemsStore.getState().setUserItems(save.items);

  const stats = accountStatsStore.getState();
  stats.setTotalBattles(save.stats.totalBattles);
  stats.setTotalBattlesWon(save.stats.totalBattlesWon);
  stats.setTotalBattlesLost(save.stats.totalBattlesLost);
  stats.setTotalPokemonCaught(save.stats.totalPokemonCaught);
  stats.setTotalPokemonSeen(save.stats.totalPokemonSeen);
  if (save.stats.username) {
    stats.setUsername(save.stats.username);
  }

  if (save.score) {
    useScoreSystem.setState({
      totalScore: save.score.totalScore,
      scoreHistory: save.score.scoreHistory as any,
      locationWins: save.score.locationWins,
      previousMilestones: save.score.previousMilestones as any,
      currentRunId: null,
    });
  }
}

let stopAutoSave: (() => void) | null = null;

/**
 * Start saving this guest's game automatically whenever it changes.
 * Call when a guest starts or continues a game. Safe to call more than once.
 */
export function beginGuestSession(): void {
  if (stopAutoSave) return;

  let pending: ReturnType<typeof setTimeout> | null = null;

  // Battles change HP several times a second, so wait for a short pause
  // before writing rather than saving on every single change.
  const queueSave = () => {
    if (!loggedStore.getState().hasPokemon) return;
    if (pending) clearTimeout(pending);
    pending = setTimeout(() => {
      pending = null;
      saveGuestProgress();
    }, 300);
  };

  const unsubscribers = [
    userPokemonDetailsStore.subscribe(queueSave),
    itemsStore.subscribe(queueSave),
    accountStatsStore.subscribe(queueSave),
    useScoreSystem.subscribe(queueSave),
    loggedStore.subscribe(queueSave),
  ];

  stopAutoSave = () => {
    if (pending) clearTimeout(pending);
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    stopAutoSave = null;
  };
}

/** Stop auto-saving (used by tests and when a guest session ends). */
export function endGuestSession(): void {
  stopAutoSave?.();
}
