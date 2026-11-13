import React, { useEffect, useRef, useState } from 'react';
import { battleLogStore } from '../../../../store/battleLogStore';
import { pokeData } from '../../../../store/pokemonDataStore';
import { capitalizeString, checkPokemonIsSeen } from '../../../utils/helperfn';
import Pokemon, {
  applyLevelMultipliers,
} from '../../../utils/pokemonToBattleHelpers';
import { IPokemonMergedProps } from '../../PokemonParty';
import { IbattleStateAndTypeInfo } from '../BattleScreen';
import BattleActionButtons from '../battleScreenComponents/BattleActionButtons';
import BattleCard, { ICatchFx } from '../battleScreenComponents/BattleCard';
import { IHitFx } from '../battleScreenComponents/HealthLostAnimation';
import BattleLog from '../battleScreenComponents/BattleLog';
import BattleOverCard from '../battleScreenComponents/BattleOverCard';
import userPokemonDetailsStore from '../../../../store/userPokemonDetailsStore';
import { api } from '../../../utils/apiCallsNext';
import { useAuth0 } from '@auth0/auth0-react';
import { useScoreSystem } from '../../../../store/scoringSystem';
import userInBattleStoreFlag from '../../../../store/userInBattleStoreFlag';

// Animation timing. Both attacks in a turn are worked out at once, so the
// second one is shown a beat later to let each be seen on its own.
const ATTACK_STAGGER_MS = 450;
// How long after an attack starts the hit lands on the defender.
const HIT_DELAY_MS = 180;
// How long the fainting animation gets before the battle-over card covers it.
const FAINT_SHOW_MS = 650;
// How long the caught Pokeball is shown before the battle-over card.
const CAUGHT_SHOW_MS = 900;

const NO_HIT: IHitFx = { tick: 0, damage: 0, dodged: false, critical: false };

export interface IbattleStateAndTypeInfoWithOpponent
  extends IbattleStateAndTypeInfo {
  opponentPokemon: pokeData;
}

const MainBattleLocation = (
  battleStateAndTypeInfo: IbattleStateAndTypeInfoWithOpponent
) => {
  const {
    playerPokemon,
    opponentPokemon,
    battleLocation,
    setBattleTypeChosen,
  } = battleStateAndTypeInfo;

  const { user } = useAuth0();
  const { onBattleWin, onBattleLoss } = useScoreSystem();

  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );

  useEffect(() => {
    checkPokemonIsSeen(opponentPokemon.pokedex_number, user && user.sub);
  }, [opponentPokemon]);

  const currentPokemonFromStore = userPokemonDetailsStore(
    (state) => state.userPokemonData
  ).find(
    (pokemonData) =>
      pokemonData.pokedex_number === playerPokemon?.pokedex_number
  );

  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  // Set player HP from store data
  const [playerHP, setPlayerHP] = useState(
    currentPokemonFromStore?.remainingHp ?? playerPokemon!.hp
  );

  // Set opponent HP from the already-multiplied value in opponentPokemon
  const [opponentHP, setOpponentHP] = useState(opponentPokemon.hp);

  // Log initial HP values for debugging
  React.useEffect(() => {
    console.log('Initial HP values:', {
      playerPokemon: playerPokemon?.name,
      playerHP: playerHP,
      opponentPokemon: opponentPokemon.name,
      opponentHP: opponentHP,
      opponentLevel: opponentPokemon.opponentLevel || 1,
      opponentMaxHP: opponentPokemon.maxHp,
    });
  }, [playerHP, opponentHP, opponentPokemon, playerPokemon]);

  const [battleContinues, setBattleContinues] = useState(true);
  const setBattleOver = userInBattleStoreFlag((state) => state.setBattleOver);

  // Sync battleOver flag to store, and reset on unmount
  useEffect(() => {
    if (!battleContinues) setBattleOver(true);
    return () => setBattleOver(false);
  }, [battleContinues]);

  const [winner, setWinner] = useState('');

  // Animation state for the two cards: how many times each has attacked, the
  // latest hit on each, and where a Pokeball throw is up to.
  const [playerAttackTick, setPlayerAttackTick] = useState(0);
  const [opponentAttackTick, setOpponentAttackTick] = useState(0);
  const [playerHitFx, setPlayerHitFx] = useState<IHitFx>(NO_HIT);
  const [opponentHitFx, setOpponentHitFx] = useState<IHitFx>(NO_HIT);
  const [catchFx, setCatchFx] = useState<ICatchFx>({
    phase: 'idle',
    ball: 'Pokeball',
  });
  // Position of the next attack within the current turn (0 = first).
  const attackOrderRef = useRef(0);

  // The battle-over card waits for the last hit and faint (or the caught
  // Pokeball) to be seen. Running away shows it straight away.
  const [showBattleOver, setShowBattleOver] = useState(false);
  // The winner as far as the cards are concerned: they only turn green / red
  // once the final hit has actually landed on screen.
  const [winnerOnCards, setWinnerOnCards] = useState('');
  useEffect(() => {
    if (battleContinues) return;
    let finalHitDelay = 0;
    let battleOverDelay = 0;
    if (winner === 'player' || winner === 'opponent') {
      const lastAttackOrder = Math.max(attackOrderRef.current - 1, 0);
      finalHitDelay = lastAttackOrder * ATTACK_STAGGER_MS + HIT_DELAY_MS;
      battleOverDelay = finalHitDelay + FAINT_SHOW_MS;
    } else if (winner === '') {
      battleOverDelay = CAUGHT_SHOW_MS;
    }
    const cardsTimer = setTimeout(
      () => setWinnerOnCards(winner),
      finalHitDelay
    );
    const overTimer = setTimeout(() => setShowBattleOver(true), battleOverDelay);
    return () => {
      clearTimeout(cardsTimer);
      clearTimeout(overTimer);
    };
  }, [battleContinues, winner]);

  // Plays one attack on the cards: the attacker lunges and its move lights up,
  // then the hit (or dodge) shows on the defender.
  function playAttackFx(
    attacker: 'player' | 'opponent',
    result: {
      finalDamage: number;
      moveUsed: string;
      dodged: boolean;
      critical: boolean;
    }
  ) {
    const startDelay = attackOrderRef.current * ATTACK_STAGGER_MS;
    attackOrderRef.current += 1;
    const setAttackTick =
      attacker === 'player' ? setPlayerAttackTick : setOpponentAttackTick;
    const setActiveMove =
      attacker === 'player' ? setPlayerActiveMove : setOpponentActiveMove;
    const setDefenderHitFx =
      attacker === 'player' ? setOpponentHitFx : setPlayerHitFx;

    setTimeout(() => {
      setAttackTick((tick) => tick + 1);
      setActiveMove(result.moveUsed);
      // Clear the move highlight after a delay
      setTimeout(() => setActiveMove(null), 1500);
      setTimeout(() => {
        setDefenderHitFx((previous) => ({
          tick: previous.tick + 1,
          damage: result.finalDamage,
          dodged: result.dodged,
          critical: result.critical,
        }));
      }, HIT_DELAY_MS);
    }, startDelay);
  }

  const [loadedComplete, setLoadedComplete] = useState(false);
  useEffect(() => {
    setLoadedComplete(true);
  }, []);

  const [failedPokeballCapture, setFailedPokeballCapture] = useState(0);

  useEffect(() => {
    if (loadedComplete) {
      determineAttackOutcome(false, true);
    }
  }, [failedPokeballCapture]);

  // State for tracking active moves (for animation)
  const [playerActiveMove, setPlayerActiveMove] = useState<string | null>(null);
  const [opponentActiveMove, setOpponentActiveMove] = useState<string | null>(null);

  // BATTLE VARS FROM POKEMON CLASS
  // Create Pokemon class instances once
  const playerClass = React.useMemo(
    () =>
      new Pokemon({
        name: playerPokemon!.name,
        hp: currentPokemonFromStore?.remainingHp ?? playerPokemon!.hp,
        maxHp: playerPokemon!.maxHp,
        attack: playerPokemon!.attack,
        defense: playerPokemon!.defense,
        speed: playerPokemon!.speed,
        pokedex_number: playerPokemon!.pokedex_number,
        types: playerPokemon!.types,
        moves: playerPokemon!.moves,
      }),
    [playerPokemon, currentPokemonFromStore]
  );

  // Log opponent stats for debugging
  // React.useEffect(() => {
  //   console.log('Opponent Pokémon Stats:', {
  //     name: opponentPokemon.name,
  //     level: opponentPokemon.opponentLevel || 1,
  //     hp: opponentPokemon.hp,
  //     maxHp: opponentPokemon.maxHp,
  //     attack: opponentPokemon.attack,
  //     defense: opponentPokemon.defense,
  //     speed: opponentPokemon.speed,
  //     pokedex_number: opponentPokemon.pokedex_number,
  //     types: opponentPokemon.types,
  //   });
  // }, [opponentPokemon]);

  // Create the opponent class instance ONLY ONCE with the already multiplied stats
  const opponentClass = React.useMemo(
    () =>
      new Pokemon({
        name: opponentPokemon.name,
        maxHp: opponentPokemon.maxHp,
        hp: opponentPokemon.hp, // Start with the initial HP from the opponent object
        attack: opponentPokemon.attack,
        defense: opponentPokemon.defense,
        speed: opponentPokemon.speed,
        pokedex_number: opponentPokemon.pokedex_number,
        types: opponentPokemon.types,
        moves: opponentPokemon.moves,
      }),
    // Only depend on the initial opponent Pokémon
    [opponentPokemon]
  );

  // Update the HP value in the class when opponentHP changes
  React.useEffect(() => {
    opponentClass.hp = opponentHP;
  }, [opponentHP, opponentClass]);

  function checkIfPokemonHasFainted(messageLogToLoop: string[]): boolean {
    // If the battle has already ended, don't proceed
    if (!battleContinues) return false;

    if (playerClass.hp <= 0) {
      // End the battle
      setWinner('opponent');
      messageLogToLoop.push(
        `${capitalizeString(opponentPokemon.name)} has won the battle!`
      );

      // Register battle loss in scoring system
      onBattleLoss();

      // Set battleContinues to false to prevent further actions
      setBattleContinues(false);
      return true;
    } else if (opponentClass.hp <= 0) {
      // End the battle
      setWinner('player');
      messageLogToLoop.push(
        `${capitalizeString(playerPokemon!.name)} has won the battle!`
      );

      // Register battle win in scoring system with the location ID
      if (battleLocation) {
        onBattleWin(battleLocation);
      }

      // Set battleContinues to false to prevent further actions
      setBattleContinues(false);
      return true;
    }
    return false;
  }

  function perfromAttack(
    attackingPokemon: pokeData | undefined,
    playerPokemon: IPokemonMergedProps | undefined,
    opponentPokemon: pokeData | undefined,
    messageLogToLoop: string[]
  ) {
    if (attackingPokemon === playerPokemon) {
      const attackResult = playerClass.attackOpponent(opponentClass, messageLogToLoop);
      playAttackFx('player', attackResult);
      setOpponentHP(opponentClass.hp); // Update HP in state
    } else {
      const playerInfo = opponentClass.attackOpponent(
        playerClass,
        messageLogToLoop
      );
      playAttackFx('opponent', playerInfo);

      setPlayerHP(playerInfo.hpLeft);

      if (user && user.sub) {
        api.updatePokemon(playerPokemon!.pokedex_number, user.sub, {
          remainingHp: playerClass.hp,
        });
      } else {
        updateUserPokemonData(playerPokemon!.pokedex_number, {
          remainingHp: playerClass.hp,
        });
      }
    } // Update HP in state
    let hasFainted = checkIfPokemonHasFainted(messageLogToLoop);
    return hasFainted;
  }

  function determineAttackOutcome(isFirstAttack = true, isRetaliation = false) {
    let messageLogToLoop: string[] = [];
    attackOrderRef.current = 0;

    const pokemonAttackingFirst =
      opponentClass.speed > playerClass.speed ? 'opponent' : 'player';
    const pokemonAttackingSecond =
      opponentClass.speed > playerClass.speed ? 'player' : 'opponent';

    function performAttackSequence(isFirstAttack: boolean) {
      let attackingPokemon =
        pokemonAttackingFirst === 'player' ? playerPokemon : opponentPokemon;
      let defendingPokemon =
        pokemonAttackingFirst === 'player' ? opponentPokemon : playerPokemon;

      let doesAttackResultInBattleEnd = false;
      if (isRetaliation) {
        attackingPokemon = opponentPokemon;
        defendingPokemon = playerPokemon;

        messageLogToLoop.push(
          `${capitalizeString(attackingPokemon!.name)} attacks in retaliation.`
        );
        doesAttackResultInBattleEnd = perfromAttack(
          attackingPokemon,
          playerPokemon,
          opponentPokemon,
          messageLogToLoop
        );
        // Already knows it's not the first attack, so no need specify the end in battle.
      } else if (isFirstAttack) {
        messageLogToLoop.push(
          `${capitalizeString(attackingPokemon!.name)} has the faster attack and makes the first move.`
        );
        doesAttackResultInBattleEnd = perfromAttack(
          attackingPokemon,
          playerPokemon,
          opponentPokemon,
          messageLogToLoop
        );
      } else {
        messageLogToLoop.push(
          `${capitalizeString(defendingPokemon!.name)} attacks in retaliation.`
        );
        doesAttackResultInBattleEnd = perfromAttack(
          defendingPokemon,
          playerPokemon,
          opponentPokemon,
          messageLogToLoop
        );
      }
      return doesAttackResultInBattleEnd;
    }

    let doesAttackResultInBattleEnd = performAttackSequence(isFirstAttack);

    if (!doesAttackResultInBattleEnd && isFirstAttack) {
      // If the battle continues
      performAttackSequence(false); // Perform the attack sequence again. False means retaliation.
    }

    messageLogToLoop.forEach((message, index) => {
      setTimeout(() => {
        addToMessageLogInStore(message);
      }, index * 150); // Add a delay of 1 second between each message
    });
  }

  if (!playerPokemon) {
    // Optionally render a loading indicator or return null
    return <div>Loading player pokemon...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Battle cards section - takes all available space */}
      <div className="flex-1 min-h-0 sm:max-h-[90%] w-full flex flex-row items-stretch justify-center gap-1 sm:gap-4 lg:gap-10 px-1 py-1">
        {/* Opponent card - always on the right */}
        <div
          id="opponent-card"
          className="flex-1 min-w-0 min-h-0 flex justify-center sm:justify-start items-center order-2"
        >
          <BattleCard
            pokemon={opponentPokemon}
            isLoggedInUser={false}
            pokemonClass={opponentClass}
            isPlayer={false}
            winner={winnerOnCards}
            playerHP={playerHP}
            opponentPokemon={playerPokemon}
            activeMove={opponentActiveMove}
            attackTick={opponentAttackTick}
            hitFx={opponentHitFx}
            catchFx={catchFx}
          />
        </div>

        {/* Player card - always on the left */}
        <div
          id="player-card"
          className="flex-1 min-w-0 items-center flex min-h-0 justify-center sm:justify-end order-1"
        >
          <BattleCard
            pokemon={playerPokemon}
            isLoggedInUser={true}
            pokemonClass={playerClass}
            isPlayer={true}
            winner={winnerOnCards}
            playerHP={playerHP}
            opponentPokemon={opponentPokemon}
            activeMove={playerActiveMove}
            attackTick={playerAttackTick}
            hitFx={playerHitFx}
          />
        </div>

        {/* Battle over card - positioned fixed over the battle area */}
        {showBattleOver && (
          <div className="fixed inset-0 flex items-center justify-center z-[50] bg-black bg-opacity-50 motion-safe:animate-overlay-in">
            <BattleOverCard
              playerPokemon={playerPokemon}
              opponentPokemon={opponentPokemon}
              opponentClass={opponentClass}
              playerClass={playerClass}
              winner={winner}
              battleLocation={battleLocation}
              setBattleTypeChosen={setBattleTypeChosen}
            />
          </div>
        )}
      </div>

      {/* Battle controls - under the cards on phones (so nothing is covered),
          fixed at the bottom between the orbs on larger screens */}
      <div className="flex-none w-full px-1 pb-1 mx-auto sm:px-0 sm:pb-0 sm:fixed sm:bottom-16 lg:bottom-18 sm:left-1/2 sm:-translate-x-1/2 sm:w-[65%] md:w-[55%] max-w-[550px] tall:max-w-[640px] z-[5]">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-1 sm:p-1.5 tall:p-2">
          {/* Action buttons */}
          <BattleActionButtons
            playerPokemon={playerPokemon}
            playerClass={playerClass}
            opponentPokemon={opponentPokemon}
            opponentClass={opponentClass}
            determineAttackOutcome={determineAttackOutcome}
            battleContinues={battleContinues}
            setBattleContinues={setBattleContinues}
            setPlayerHP={setPlayerHP}
            setFailedPokeballCapture={setFailedPokeballCapture}
            setCatchFx={setCatchFx}
            setWinner={setWinner}
            setBattleTypeChosen={setBattleTypeChosen}
          />
          {/* Battle log - capped height with scroll */}
          <div className="mt-1 h-20 overflow-hidden">
            <BattleLog
              playerPokemon={playerPokemon}
              opponentPokemon={opponentPokemon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBattleLocation;
