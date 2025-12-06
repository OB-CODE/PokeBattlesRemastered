'use client';
import React, { SetStateAction, useEffect, useState } from 'react';
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

  const { isAuthenticated, logout } = useAuth0();

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

  useEffect(() => {
    console.log('showCandyCane rendered or updated');
    console.log('showCandyCane state:', showCandyCane);
  }, [showCandyCane]);

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
          <div className="flex flex-col w-full h-full items-center">
            <ItemUpdateTrigger />
            <AccountStatTrigger />
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
        </GameShell>
      ) : (
        <ChooseStarterPokemon />
      )}
      <AccountIndex {...infoForAccount} />
      <ScoreIndex {...infoForScore} />
    </div>
  );
};

export default GameMainPage;
