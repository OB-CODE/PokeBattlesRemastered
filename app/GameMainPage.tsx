'use client';
import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import { loggedStore } from '../store/userLogged';
import ChooseStarterPokemon from './component/ChooseStarterPokemon';

import { useAuth0 } from '@auth0/auth0-react';
import userInBattleStoreFlag from '../store/userInBattleStoreFlag';
import AccountStatTrigger from './AccountStatTrigger';
import AccountIndex from './component/Account/AccountIndex';
import BackpackIndex from './component/backpack/BackpackIndex';
import BattleScreen from './component/battle/BattleScreen';
import HealIndex from './component/Heal/HealIndex';
import Pokedex from './component/Pokedex';
import PokemonParty, { IPokemonMergedProps } from './component/PokemonParty';
import ScoreIndex from './component/score/ScoreIndex';
import ShopIndex from './component/shop/ShopIndex';
import ItemUpdateTrigger from './ItemUpdateTrigger';
import { backpackSCG, shopSVG } from './utils/UI/svgs';
import {
  blueButton,
  blueButtonSmall,
  silverButton,
  yellowButton,
} from './utils/UI/UIStrings';
import CandyCaneIndex from './component/candyCane/CandyCaneIndex';
import GameShell from './component/shell/GameShell';
import accountStatsStore from '../store/accountStatsStore';
import OutOfResourcesModal from './component/OutOfResourcesModal';
import GameWonModal from './component/GameWonModal';
import { itemsStore } from '../store/itemsStore';
import userPokemonDetailsStore from '../store/userPokemonDetailsStore';
import { returnMergedPokemon } from './utils/pokemonToBattleHelpers';
import useScoreSystem from '../store/scoringSystem';
import ScoreUpdateTrigger from './component/ScoreUpdateTrigger';
import { api } from './utils/apiCallsNext';
// const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

export interface IhealPokemonInfo {
  showHealPokemon: boolean;
  setShowHealPokemon: React.Dispatch<SetStateAction<boolean>>;
}

export interface IbackpackInfo {
  showBackPack: boolean;
  setShowBackpack: React.Dispatch<SetStateAction<boolean>>;
  setShowCandyCane: React.Dispatch<SetStateAction<boolean>>;
}

export interface IshopInfo {
  showShop: boolean;
  setShowShop: React.Dispatch<SetStateAction<boolean>>;
}
export interface IallBattleStateInfo {
  playerPokemon: IPokemonMergedProps | undefined;
  setPlayerPokemon: React.Dispatch<
    React.SetStateAction<IPokemonMergedProps | undefined>
  >;
  battleTypeChosen: boolean;
  setBattleTypeChosen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IinfoForAccount {
  isViewingAccount: boolean;
  setIsViewingAccount: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IinfoForScore {
  isViewingScore: boolean;
  setIsViewingScore: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameMainPage = () => {
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);

  const { isAuthenticated, logout, user } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  // Control the account Modal pop up.
  const [isViewingAccount, setIsViewingAccount] = useState(false);
  const infoForAccount: IinfoForAccount = {
    isViewingAccount,
    setIsViewingAccount,
  };
  const [isViewingScore, setIsViewingScore] = useState(false);

  const infoForScore: IinfoForScore = {
    isViewingScore,
    setIsViewingScore,
  };

  useEffect(() => {
    if (isAuthenticated) {
      // If the user is authenticated, toggle the logged state and set user Pokemon details to default.
      toggleLoggedState();
      // fetch the user data from a db.
    }
  }, [isAuthenticated]);

  const hasFirstPokemon = loggedStore((state) => state.hasPokemon);
  const toggleHasFirstPokemon = loggedStore(
    (state) => state.toggleHasFirstPokemon
  );

  const handleToggleLogin = () => {
    toggleLoggedState();
    toggleHasFirstPokemon();
  };

  // Zustand
  const userIsInBattle = userInBattleStoreFlag((state) => state.userIsInBattle);
  const setUserIsInBattle = userInBattleStoreFlag(
    (state) => state.setUserIsInBattle
  );

  const [playerPokemon, setPlayerPokemon] = useState<
    IPokemonMergedProps | undefined
  >();

  const [battleTypeChosen, setBattleTypeChosen] = useState(false);

  const allBattleStateInfo: IallBattleStateInfo = {
    playerPokemon,
    setPlayerPokemon,
    battleTypeChosen,
    setBattleTypeChosen,
  };

  const [showPokedex, setShowPokedex] = useState<boolean>(false);
  const [showHealPokemon, setShowHealPokemon] = useState(false);
  const [showBackPack, setShowBackpack] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showCandyCane, setShowCandyCane] = useState(false);
  const [showOutOfResourcesModal, setShowOutOfResourcesModal] = useState(false);
  const [showGameWonModal, setShowGameWonModal] = useState(false);
  const [hasShownGameWonModal, setHasShownGameWonModal] = useState(false);

  // Get items and score for out of resources check
  const moneyOwned = itemsStore((state) => state.moneyOwned);
  const pokeballsOwned = itemsStore((state) => state.pokeballsOwned);
  const goldenPokeballsOwned = itemsStore((state) => state.goldenPokeballsOwned);
  const smallHealthPotionsOwned = itemsStore((state) => state.smallHealthPotionsOwned);
  const largeHealthPotionsOwned = itemsStore((state) => state.largeHealthPotionsOwned);
  const candyCanesOwned = itemsStore((state) => state.candyCanesOwned);
  const pokeballGlovesOwned = itemsStore((state) => state.pokeballGlovesOwned);

  const pokemonDataStore = userPokemonDetailsStore((state) => state.userPokemonData);
  const updateUserPokemonData = userPokemonDetailsStore((state) => state.updateUserPokemonData);

  const { totalScore, onOutOfResources, getCurrentRank, previousMilestones, currentRunId } = useScoreSystem();

  // Check if user has any sellable items
  const hasSellableItems = useMemo(() => {
    return (
      pokeballsOwned > 0 ||
      goldenPokeballsOwned > 0 ||
      smallHealthPotionsOwned > 0 ||
      largeHealthPotionsOwned > 0 ||
      candyCanesOwned > 0 ||
      pokeballGlovesOwned > 0
    );
  }, [pokeballsOwned, goldenPokeballsOwned, smallHealthPotionsOwned, largeHealthPotionsOwned, candyCanesOwned, pokeballGlovesOwned]);

  // Get merged pokemon data to check health
  const mergedPokemonData = useMemo(() => {
    return returnMergedPokemon();
  }, [pokemonDataStore]);

  // Check if all party pokemon have fainted (0 HP)
  const allPartyPokemonFainted = useMemo(() => {
    const partyPokemon = mergedPokemonData.filter(p => p.inParty && p.caught && p.active !== false);
    if (partyPokemon.length === 0) return false;
    return partyPokemon.every(pokemon => pokemon.hp <= 0);
  }, [mergedPokemonData]);

  // Check if user is out of resources (all pokemon fainted, no money, no items)
  const isOutOfResources = useMemo(() => {
    return allPartyPokemonFainted && moneyOwned <= 0 && !hasSellableItems;
  }, [allPartyPokemonFainted, moneyOwned, hasSellableItems]);

  // Show the modal when user is out of resources (but only if they have a first pokemon)
  useEffect(() => {
    if (isOutOfResources && hasFirstPokemon && !userIsInBattle) {
      setShowOutOfResourcesModal(true);
    }
  }, [isOutOfResources, hasFirstPokemon, userIsInBattle]);

  // Check if user has caught all 151 pokemon for the first time
  const totalCaughtPokemon = useMemo(() => {
    return pokemonDataStore.filter(p => p.caught).length;
  }, [pokemonDataStore]);

  // Show game won modal when user catches all 151 pokemon for the first time
  useEffect(() => {
    if (totalCaughtPokemon >= 151 && hasFirstPokemon && !hasShownGameWonModal && !previousMilestones.pokemon151) {
      setShowGameWonModal(true);
      setHasShownGameWonModal(true);

      // Finalize the active game run
      if (user?.sub && currentRunId) {
        api.finalizeGameRun(user.sub, currentRunId, totalScore).catch((err) =>
          console.error('Failed to finalize game run on win:', err)
        );
      }
    }
  }, [totalCaughtPokemon, hasFirstPokemon, hasShownGameWonModal, previousMilestones.pokemon151]);

  // Handle resetting pokemon health and halving score
  const handleOutOfResourcesConfirm = () => {
    // Halve the score via scoring system
    onOutOfResources();

    // Restore all party pokemon to full health
    const partyPokemon = mergedPokemonData.filter(p => p.inParty && p.caught && p.active !== false);
    partyPokemon.forEach(pokemon => {
      updateUserPokemonData(pokemon.pokedex_number, {
        remainingHp: pokemon.maxHp,
      });
    });

    // Close the modal
    setShowOutOfResourcesModal(false);
  };


  const healPokemonInfo = {
    showHealPokemon,
    setShowHealPokemon,
  };

  const backPackInfo: IbackpackInfo = { showBackPack, setShowBackpack, setShowCandyCane };

  const shopInfo: IshopInfo = {
    showShop,
    setShowShop,
  };

  const candyCaneInfo = {
    showCandyCane,
    setShowCandyCane,
  };

  return (
    <div className="w-[95%] h-[95%] m-auto border-4 border-black bg-white bg-opacity-80">

      {hasFirstPokemon ? (
        <GameShell
          showPokedex={showPokedex}
          setShowPokedex={setShowPokedex}
          setShowHealPokemon={setShowHealPokemon}
          setShowShop={setShowShop}
          setShowBackpack={setShowBackpack}
          setIsViewingAccount={setIsViewingAccount}
          setIsViewingScore={setIsViewingScore}
          handleToggleLogin={handleToggleLogin}
          logoutWithRedirect={logoutWithRedirect}
          battleTypeChosen={battleTypeChosen}
          setUserIsInBattle={setUserIsInBattle}
        >
          <div className="h-[90%] flex flex-col w-full items-center">
            <ItemUpdateTrigger />
            <AccountStatTrigger />
            <ScoreUpdateTrigger />
            {/* Not showing this page will also remove the top level heal buttons and allow for more screen space. */}
            {userIsInBattle && playerPokemon && (
              <>
                <BattleScreen {...allBattleStateInfo} />
              </>
            )}

            {/* TODO: Logic for BATTLE - Need a new page to take pokemon to first and further test seen and caught logic.  */}
            {!userIsInBattle && (
              <>
                {showPokedex ? (
                  <Pokedex />
                ) : (
                  <PokemonParty {...allBattleStateInfo} />
                )}
              </>
            )}
          </div>

          <HealIndex {...healPokemonInfo} />
          <BackpackIndex {...backPackInfo} />
          <ShopIndex {...shopInfo} />
          <CandyCaneIndex {...candyCaneInfo} />
          <OutOfResourcesModal
            open={showOutOfResourcesModal}
            onConfirm={handleOutOfResourcesConfirm}
            currentScore={totalScore}
          />
          <GameWonModal
            open={showGameWonModal}
            onClose={() => setShowGameWonModal(false)}
            finalScore={totalScore}
            rank={getCurrentRank()}
          />
        </GameShell>
      ) : (
        <GameShell disabled>
          <ChooseStarterPokemon />
        </GameShell>
      )}
      <AccountIndex {...infoForAccount} />
      <ScoreIndex {...infoForScore} />
    </div>
  );
};

export default GameMainPage;
