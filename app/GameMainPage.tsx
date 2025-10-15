"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import { loggedStore } from "../store/userLogged";
import ChooseStarterPokemon from "./component/ChooseStarterPokemon";

import { useAuth0 } from "@auth0/auth0-react";
import userInBattleStoreFlag from "../store/userInBattleStoreFlag";
import AccountStatTrigger from "./AccountStatTrigger";
import AccountIndex from "./component/Account/AccountIndex";
import BackpackIndex from "./component/backpack/BackpackIndex";
import BattleScreen from "./component/battle/BattleScreen";
import HealIndex from "./component/Heal/HealIndex";
import Pokedex from "./component/Pokedex";
import PokemonParty, { IPokemonMergedProps } from "./component/PokemonParty";
import ScoreIndex from "./component/score/ScoreIndex";
import ShopIndex from "./component/shop/ShopIndex";
import ItemUpdateTrigger from "./ItemUpdateTrigger";
import { backpackSCG, shopSVG } from "./utils/UI/svgs";
import {
  blueButton,
  blueButtonSmall,
  silverButton,
  yellowButton,
} from "./utils/UI/UIStrings";
// const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

export interface IhealPokemonInfo {
  showHealPokemon: boolean;
  setShowHealPokemon: React.Dispatch<SetStateAction<boolean>>;
}

export interface IbackpackInfo {
  showBackPack: boolean;
  setShowBackpack: React.Dispatch<SetStateAction<boolean>>;
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

  const healPokemonInfo = {
    showHealPokemon,
    setShowHealPokemon,
  };

  const backPackInfo: IbackpackInfo = { showBackPack, setShowBackpack };

  const shopInfo: IshopInfo = {
    showShop,
    setShowShop,
  };

  return (
    <div className="w-[95%] h-[95%] m-auto border-4 border-black bg-white bg-opacity-80">
      {hasFirstPokemon ? (
        <div className="flex flex-col w-full h-full items-center justify-between">
          <ItemUpdateTrigger />
          <AccountStatTrigger />
          {/* Not showing this page will also remove the top level heal buttons and allow for more screen space. */}
          {userIsInBattle && playerPokemon && (
            <>
              <BattleScreen {...allBattleStateInfo} />
            </>
          )}
          {/* : (
             <HealAndPokedex {...allBattleStateInfo} />
           )} */}

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

          <div
            className={`flex justify-between w-[98%] mb-5 sm:flex-row flex-col gap-[5px]`}
          >
            {/* Don't show item options when in battle.  */}
            {!userIsInBattle ? (
              <div
                id="healAndPokedex"
                className="flex items-center justify-around sm:justify-end align-bottom gap-3"
              >
                <div>
                  <button
                    className={yellowButton}
                    onClick={() => setShowPokedex(!showPokedex)}
                  >
                    {showPokedex ? "POKEMON PARTY" : "POKEDEX"}
                  </button>
                </div>
                <button
                  onClick={() => setShowHealPokemon(true)}
                  className={blueButton}
                >
                  Heal Pokemon
                </button>
                <button
                  onClick={() => setShowShop(true)}
                  className={blueButtonSmall}
                >
                  <div className="flex justify-center items-center h-10">
                    {shopSVG}
                  </div>
                </button>
                <button
                  onClick={() => setShowBackpack(true)}
                  className={blueButtonSmall}
                >
                  <div className="flex w-full justify-center  items-center h-10">
                    {backpackSCG}
                  </div>
                </button>
              </div>
            ) : (
              <div
                id="buttonHolderBack"
                className="flex items-center justify-end align-bottom gap-3"
              >
                {!battleTypeChosen ? (
                  <button
                    className={yellowButton}
                    onClick={() => setUserIsInBattle(false)}
                  >
                    Back
                  </button>
                ) : (
                  <></>
                )}
              </div>
            )}
            {/* Account and Score buttons */}

            <div
              id="accountItems"
              className="flex items-center justify-around sm:justify-end gap-5 pt-2"
            >
              <div className="text-center flex gap-1">
                <button
                  onClick={() => setIsViewingScore(true)}
                  className={blueButton}
                >
                  Check Score
                </button>
                <button
                  onClick={() => setIsViewingAccount(true)}
                  className={blueButton}
                >
                  Account
                </button>
              </div>
              <button
                // onClick={handleToggleLogin}
                onClick={() => {
                  handleToggleLogin(), logoutWithRedirect();
                }}
                className={silverButton}
              >
                log out
              </button>
            </div>
          </div>

          <HealIndex {...healPokemonInfo} />
          <BackpackIndex {...backPackInfo} />
          <ShopIndex {...shopInfo} />
        </div>
      ) : (
        <ChooseStarterPokemon />
      )}
      <AccountIndex {...infoForAccount} />
      <ScoreIndex {...infoForScore} />
    </div>
  );
};

export default GameMainPage;
