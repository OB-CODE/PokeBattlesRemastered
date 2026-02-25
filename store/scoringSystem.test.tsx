import { useScoreSystem, SCORE_CONSTANTS } from './scoringSystem';
import { accountStatsStore } from './accountStatsStore';

describe('SCORE_CONSTANTS', () => {
  test('has positive values for reward constants', () => {
    expect(SCORE_CONSTANTS.POKEMON_SEEN_POINTS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.POKEMON_CAUGHT_POINTS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.POKEDEX_MILESTONE_BONUS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.COMPLETE_POKEDEX_BONUS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.BATTLE_WIN_POINTS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.FIRST_WIN_LOCATION_BONUS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.EVOLUTION_BONUS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.LEVEL_5_BONUS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.LEVEL_10_BONUS).toBeGreaterThan(0);
    expect(SCORE_CONSTANTS.LEVEL_15_BONUS).toBeGreaterThan(0);
  });

  test('has negative values for penalty constants', () => {
    expect(SCORE_CONSTANTS.BATTLE_ENTRY_PENALTY).toBeLessThan(0);
    expect(SCORE_CONSTANTS.BATTLE_LOSS_PENALTY).toBeLessThan(0);
    expect(SCORE_CONSTANTS.BATTLE_RUN_PENALTY_BASE).toBeLessThan(0);
  });

  test('level bonuses increase with level milestone', () => {
    expect(SCORE_CONSTANTS.LEVEL_10_BONUS).toBeGreaterThan(SCORE_CONSTANTS.LEVEL_5_BONUS);
    expect(SCORE_CONSTANTS.LEVEL_15_BONUS).toBeGreaterThan(SCORE_CONSTANTS.LEVEL_10_BONUS);
  });
});

describe('useScoreSystem', () => {
  beforeEach(() => {
    // Reset scoring system
    useScoreSystem.getState().resetScore();
    // Reset account stats
    accountStatsStore.setState({
      totalBattles: 0,
      totalPokemonCaught: 0,
      totalPokemonSeen: 0,
      totalBattlesWon: 0,
      totalBattlesLost: 0,
      username: undefined,
    });
  });

  describe('addScore', () => {
    test('adds positive points to score', () => {
      useScoreSystem.getState().addScore(100, 'Test bonus');
      expect(useScoreSystem.getState().totalScore).toBe(100);
    });

    test('adds multiple scores cumulatively', () => {
      useScoreSystem.getState().addScore(50, 'First bonus');
      useScoreSystem.getState().addScore(30, 'Second bonus');
      expect(useScoreSystem.getState().totalScore).toBe(80);
    });

    test('does not allow score to go below 0', () => {
      useScoreSystem.getState().addScore(10, 'Start');
      useScoreSystem.getState().addScore(-50, 'Big penalty');
      expect(useScoreSystem.getState().totalScore).toBe(0);
    });

    test('records event in scoreHistory', () => {
      useScoreSystem.getState().addScore(100, 'Test event');
      const history = useScoreSystem.getState().scoreHistory;
      expect(history).toHaveLength(1);
      expect(history[0].points).toBe(100);
      expect(history[0].reason).toBe('Test event');
      expect(history[0].totalAfter).toBe(100);
    });

    test('limits history to 100 events', () => {
      for (let i = 0; i < 110; i++) {
        useScoreSystem.getState().addScore(1, `Event ${i}`);
      }
      expect(useScoreSystem.getState().scoreHistory.length).toBeLessThanOrEqual(100);
    });
  });

  describe('resetScore', () => {
    test('resets score to 0', () => {
      useScoreSystem.getState().addScore(500, 'Some points');
      useScoreSystem.getState().resetScore();
      expect(useScoreSystem.getState().totalScore).toBe(0);
    });

    test('clears score history', () => {
      useScoreSystem.getState().addScore(100, 'Event');
      useScoreSystem.getState().resetScore();
      expect(useScoreSystem.getState().scoreHistory).toHaveLength(0);
    });

    test('resets location wins', () => {
      useScoreSystem.getState().onBattleWin(1);
      useScoreSystem.getState().resetScore();
      expect(useScoreSystem.getState().locationWins).toEqual({});
    });

    test('resets milestones', () => {
      useScoreSystem.getState().resetScore();
      const milestones = useScoreSystem.getState().previousMilestones;
      expect(milestones.pokemon25).toBe(false);
      expect(milestones.pokemon50).toBe(false);
      expect(milestones.pokemon151).toBe(false);
    });
  });

  describe('onBattleStart', () => {
    test('applies battle entry penalty', () => {
      useScoreSystem.getState().addScore(100, 'Starting points');
      useScoreSystem.getState().onBattleStart();
      expect(useScoreSystem.getState().totalScore).toBe(100 + SCORE_CONSTANTS.BATTLE_ENTRY_PENALTY);
    });
  });

  describe('onBattleWin', () => {
    test('awards battle win points', () => {
      useScoreSystem.getState().onBattleWin(1);
      expect(useScoreSystem.getState().totalScore).toBeGreaterThanOrEqual(SCORE_CONSTANTS.BATTLE_WIN_POINTS);
    });

    test('awards first win at location bonus', () => {
      useScoreSystem.getState().onBattleWin(1);
      expect(useScoreSystem.getState().totalScore).toBe(
        SCORE_CONSTANTS.BATTLE_WIN_POINTS + SCORE_CONSTANTS.FIRST_WIN_LOCATION_BONUS
      );
    });

    test('does not award location bonus on subsequent wins', () => {
      useScoreSystem.getState().onBattleWin(1);
      const scoreAfterFirst = useScoreSystem.getState().totalScore;

      useScoreSystem.getState().onBattleWin(1);
      expect(useScoreSystem.getState().totalScore).toBe(
        scoreAfterFirst + SCORE_CONSTANTS.BATTLE_WIN_POINTS
      );
    });

    test('awards location bonus for different locations', () => {
      useScoreSystem.getState().onBattleWin(1);
      const scoreAfterFirst = useScoreSystem.getState().totalScore;

      useScoreSystem.getState().onBattleWin(2);
      expect(useScoreSystem.getState().totalScore).toBe(
        scoreAfterFirst + SCORE_CONSTANTS.BATTLE_WIN_POINTS + SCORE_CONSTANTS.FIRST_WIN_LOCATION_BONUS
      );
    });
  });

  describe('onBattleLoss', () => {
    test('applies battle loss penalty', () => {
      useScoreSystem.getState().addScore(100, 'Starting points');
      useScoreSystem.getState().onBattleLoss();
      expect(useScoreSystem.getState().totalScore).toBe(100 + SCORE_CONSTANTS.BATTLE_LOSS_PENALTY);
    });
  });

  describe('onBattleRun', () => {
    test('applies full run penalty when opponent is damaged', () => {
      useScoreSystem.getState().addScore(100, 'Starting points');
      useScoreSystem.getState().onBattleRun(50);
      expect(useScoreSystem.getState().totalScore).toBe(100 + SCORE_CONSTANTS.BATTLE_RUN_PENALTY_BASE);
    });

    test('applies reduced penalty when opponent is at full health', () => {
      useScoreSystem.getState().addScore(100, 'Starting points');
      useScoreSystem.getState().onBattleRun(100);
      const expectedPenalty = Math.round(
        SCORE_CONSTANTS.BATTLE_RUN_PENALTY_BASE * SCORE_CONSTANTS.BATTLE_RUN_FULL_HEALTH_MODIFIER
      );
      expect(useScoreSystem.getState().totalScore).toBe(100 + expectedPenalty);
    });
  });

  describe('onPokemonEvolved', () => {
    test('awards evolution bonus', () => {
      useScoreSystem.getState().onPokemonEvolved();
      expect(useScoreSystem.getState().totalScore).toBe(SCORE_CONSTANTS.EVOLUTION_BONUS);
    });
  });

  describe('onPokemonLevelUp', () => {
    test('awards base points per level gained', () => {
      useScoreSystem.getState().onPokemonLevelUp(1, 2);
      expect(useScoreSystem.getState().totalScore).toBe(15); // 15 * 1 level
    });

    test('awards points for multiple levels gained', () => {
      useScoreSystem.getState().onPokemonLevelUp(1, 4);
      expect(useScoreSystem.getState().totalScore).toBe(45); // 15 * 3 levels
    });

    test('awards level 5 milestone bonus', () => {
      useScoreSystem.getState().onPokemonLevelUp(4, 5);
      expect(useScoreSystem.getState().totalScore).toBe(15 + SCORE_CONSTANTS.LEVEL_5_BONUS);
    });

    test('awards level 10 milestone bonus', () => {
      useScoreSystem.getState().onPokemonLevelUp(9, 10);
      expect(useScoreSystem.getState().totalScore).toBe(15 + SCORE_CONSTANTS.LEVEL_10_BONUS);
    });

    test('does not award points when no levels gained', () => {
      useScoreSystem.getState().onPokemonLevelUp(5, 5);
      expect(useScoreSystem.getState().totalScore).toBe(0);
    });
  });

  describe('onOutOfResources', () => {
    test('halves the current score', () => {
      useScoreSystem.getState().addScore(200, 'Starting');
      useScoreSystem.getState().onOutOfResources();
      expect(useScoreSystem.getState().totalScore).toBe(100);
    });

    test('halves odd scores with floor rounding', () => {
      useScoreSystem.getState().addScore(101, 'Starting');
      useScoreSystem.getState().onOutOfResources();
      expect(useScoreSystem.getState().totalScore).toBe(51);
    });

    test('results in 0 when score is already 0', () => {
      useScoreSystem.getState().onOutOfResources();
      expect(useScoreSystem.getState().totalScore).toBe(0);
    });
  });

  describe('getCurrentRank', () => {
    test('returns Novice Trainer for 0 score', () => {
      expect(useScoreSystem.getState().getCurrentRank()).toBe('Novice Trainer');
    });

    test('returns Beginner Trainer for 1000+ score', () => {
      useScoreSystem.getState().addScore(1000, 'Score');
      expect(useScoreSystem.getState().getCurrentRank()).toBe('Beginner Trainer');
    });

    test('returns Pokémon Master for 40000+ score', () => {
      useScoreSystem.getState().addScore(40000, 'Score');
      expect(useScoreSystem.getState().getCurrentRank()).toBe('Pokémon Master');
    });

    test('returns correct rank at exact threshold boundaries', () => {
      useScoreSystem.getState().addScore(999, 'Score');
      expect(useScoreSystem.getState().getCurrentRank()).toBe('Novice Trainer');

      useScoreSystem.getState().addScore(1, 'Score');
      expect(useScoreSystem.getState().getCurrentRank()).toBe('Beginner Trainer');
    });
  });

  describe('startNewGameScoringZustand', () => {
    test('resets all scoring state', () => {
      useScoreSystem.getState().addScore(500, 'Points');
      useScoreSystem.getState().onBattleWin(1);
      useScoreSystem.getState().startNewGameScoringZustand('run-123');

      const state = useScoreSystem.getState();
      expect(state.totalScore).toBe(0);
      expect(state.scoreHistory).toHaveLength(0);
      expect(state.locationWins).toEqual({});
      expect(state.currentRunId).toBe('run-123');
    });

    test('sets null runId when not provided', () => {
      useScoreSystem.getState().startNewGameScoringZustand();
      expect(useScoreSystem.getState().currentRunId).toBeNull();
    });
  });

  describe('checkPokedexMilestones', () => {
    test('awards milestone bonus at 25 pokemon caught', () => {
      accountStatsStore.setState({ totalPokemonCaught: 25 });
      useScoreSystem.getState().checkPokedexMilestones();
      expect(useScoreSystem.getState().totalScore).toBe(SCORE_CONSTANTS.POKEDEX_MILESTONE_BONUS);
      expect(useScoreSystem.getState().previousMilestones.pokemon25).toBe(true);
    });

    test('does not double-award milestone', () => {
      accountStatsStore.setState({ totalPokemonCaught: 25 });
      useScoreSystem.getState().checkPokedexMilestones();
      const scoreAfterFirst = useScoreSystem.getState().totalScore;

      useScoreSystem.getState().checkPokedexMilestones();
      expect(useScoreSystem.getState().totalScore).toBe(scoreAfterFirst);
    });

    test('awards complete pokedex bonus at 151', () => {
      accountStatsStore.setState({ totalPokemonCaught: 151 });
      useScoreSystem.getState().checkPokedexMilestones();

      // Should get milestones for 25, 50, 75, 100, 125, 150, and 151 complete bonus
      const expectedScore =
        6 * SCORE_CONSTANTS.POKEDEX_MILESTONE_BONUS + SCORE_CONSTANTS.COMPLETE_POKEDEX_BONUS;
      expect(useScoreSystem.getState().totalScore).toBe(expectedScore);
    });
  });
});
