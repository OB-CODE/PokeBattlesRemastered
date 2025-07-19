"use client";
import React, { useEffect, useState } from "react";
import { loggedStore } from "../store/userLogged";
import ChooseStarterPokemon from "./component/ChooseStarterPokemon";

import userPokemonDetailsStore from "../store/userPokemonDetailsStore";
import AccountIndex from "./component/Account/AccountIndex";
import BattleScreen from "./component/battle/BattleScreen";
import HealAndPokedex from "./component/HealAndPokedex";
import { IPokemonMergedProps } from "./component/PokemonParty";
import userInBattleStoreFlag from "../store/userInBattleStoreFlag";
import { useAuth0 } from "@auth0/auth0-react";
import ItemUpdateTrigger from "./ItemUpdateTrigger";
import AccountStatTrigger from "./AccountStatTrigger";
import ScoreIndex from "./component/score/ScoreIndex";
// const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

export interface IallBattleStateInfo {
  playerPokemon: IPokemonMergedProps | undefined;
  setPlayerPokemon: React.Dispatch<
    React.SetStateAction<IPokemonMergedProps | undefined>
  >;
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
  const loggedState = loggedStore((state) => state.loggedIn);
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);
  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

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

  const userIsInBattle = userInBattleStoreFlag((state) => state.userIsInBattle);

  const [playerPokemon, setPlayerPokemon] = useState<
    IPokemonMergedProps | undefined
  >();

  const allBattleStateInfo: IallBattleStateInfo = {
    playerPokemon,
    setPlayerPokemon,
  };

  return (
    <div className="w-[90%] h-[80%] mx-auto my-5 border-4 border-black bg-white bg-opacity-80">
      {hasFirstPokemon ? (
        <div className="flex flex-col w-full h-full items-center justify-between">
          <ItemUpdateTrigger />
          <AccountStatTrigger />
          {/* Not showing this page will also remove the top level heal buttons and allow for more screen space. */}
          {userIsInBattle && playerPokemon ? (
            <BattleScreen {...allBattleStateInfo} />
          ) : (
            <HealAndPokedex {...allBattleStateInfo} />
          )}

          {/* TODO: Logic for BATTLE - Need a new page to take pokemon to first and further test seen and caught logic.  */}

          <div className="flex justify-between w-[90%] mb-5">
            <button
              // onClick={handleToggleLogin}
              onClick={() => {
                handleToggleLogin(), logoutWithRedirect();
              }}
              className="text-black bg-blue-300 hover:bg-blue-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            >
              log out
            </button>

            <div>
              <button
                onClick={() => setIsViewingScore(true)}
                className="text-black bg-blue-300 hover:bg-blue-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              >
                Check Score
              </button>
              <button
                onClick={() => setIsViewingAccount(true)}
                className="text-black bg-blue-300 hover:bg-blue-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              >
                Account
              </button>
            </div>
          </div>
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
