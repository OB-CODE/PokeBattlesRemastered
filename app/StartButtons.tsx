'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { loggedStore } from '../store/userLogged';
import userPokemonDetailsStore, {
  IUserPokemonData,
} from '../store/userPokemonDetailsStore';
import Modal from './Modal';
//Trigger build again

import { useAuth0 } from '@auth0/auth0-react';
import { userApi } from './utils/apiCallsNext';
import accountStatsStore from '../store/accountStatsStore';
import useScoreSystem from '../store/scoringSystem';
import { useCollapsedLocationsStore } from '../store/expandedLocationsStore'; // Correct import path

const StartButtons = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const { startNewGameScoringZustand } = useScoreSystem();
  const [userPokemonDetailsFetched, setUserPokemonDetailsFetched] = useState<
    IUserPokemonData[]
  >([]);

  const userPokemonZustand = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      // fetch(`/api/getUsersPokemonStats? user_id=${encodeURIComponent(user.sub)}`)
      fetch(`/api/getUsersPokemonStats?user_id=${encodeURIComponent(user.sub)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            console.log(data);
            // pass in the correct user data.
            setUserPokemonDetailsFetched(data);
          } else {
            // If no data is returned, set the user Pokemon details to default.
            setUserPokemonDetailsToDefault(user.sub);
          }
        });

      // Connect with the items / money database for the user.

      // Connect with the user details database for the user.
    }
  }, [isAuthenticated, user]);

  const loggedState = loggedStore((state) => state.loggedIn);
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);

  function setUserPokemonDetailsToDefault(userId?: string) {
    // If userId is provided, use it; otherwise call the API without it
    const fetchData = async () => {
      try {
        // have 2 fetch calls, one for the user id and one for the default data.
        if (!userId) {
          const response = await fetch('/api/createNewUserPokemonDetails');
          const data = await response.json();
          userPokemonDetailsStore.getState().setUserPokemonData(data.message);
        }
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };
    fetchData();
  }

  const handleToggleLoginWithoutAccount = () => {
    startNewGameScoringZustand();
    toggleLoggedState();
    setUserPokemonDetailsToDefault();
    // Reset collapsed locations Zustand store
    useCollapsedLocationsStore.getState().resetCollapsedLocations();
  };

  // code for the How To Modal
  let bigBody = (
    <div className="flex flex-col gap-4">
      <div className="font-semibold text-blue-700">🎯 Goal</div>
      <div>Catch all 151 original Pokemon!</div>

      <div className="font-semibold text-blue-700">⚔️ Battling</div>
      <div>
        Injure Pokemon to increase catch chance. Too much damage makes them faint (gives XP instead).
      </div>

      <div className="font-semibold text-blue-700">🗺️ Locations</div>
      <div>
        Different Pokemon appear in different locations. Explore all areas to find them all!
      </div>

      <div className="font-semibold text-blue-700">🚫 Repel</div>
      <div>
        Speed up your progress by repelling Pokemon you've already caught (for a cost). This increases your chances of encountering new Pokemon.
      </div>

      <div className="font-semibold text-green-700">💡 Tips</div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
        <ul className="list-disc list-inside space-y-1">
          <li>Switch to healthy Pokemon during battle</li>
          <li>Heal at the Poke Center or use potions</li>
          <li>Keep money for healing - sell items if needed</li>
        </ul>
      </div>

      <div className="font-semibold text-red-700">⚠️ Warning</div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
        <p>
          If all Pokemon faint with no money or items to sell, you must reset and your score will be halved!
        </p>
      </div>
    </div>
  );

  const [howToisModalOpen, setHowToIsModalOpen] = useState(false);

  useEffect(() => {
    // If the user is authenticated, set the modal to open
    if (isAuthenticated) {
      setStartIsModalOpen(true);
    } else {
      setStartIsModalOpen(false);
    }
  }, [isAuthenticated]);

  function startNewGame() {
    // Logic to start a new game
    handleToggleLoginWithoutAccount(); // currently not linked to a username.
    // need to reset the user Pokemon details to default.
    // mirror 'Start without an account' functionality.

    // Reset scoring Zustand store
    startNewGameScoringZustand();

    // Reset collapsed locations Zustand store
    const resetCollapsedLocations = useCollapsedLocationsStore(
      (state) => state.resetCollapsedLocations
    );
    resetCollapsedLocations();

    console.log('Starting a new game...');
  }

  const howToOpenModal = () => {
    setHowToIsModalOpen(true);
  };

  const howToCloseModal = () => {
    setHowToIsModalOpen(false);
  };

  async function continueGameHandler() {
    // Logic to continue the game
    console.log('Continuing the game...');
    toggleLoggedState();
    // If data returns - The user is already passed choosing their starter Pokemon.
    if (userPokemonDetailsFetched.length > 0) {
      userPokemonDetailsStore
        .getState()
        .setUserPokemonData(userPokemonDetailsFetched);

      // set the store to show the user has their starter Pokemon.
      loggedStore.getState().toggleHasFirstPokemon();
    }

    setUserPokemonDetailsToDefault(user?.sub);

    // Put the username in the Zustand store.
    if (user && user.sub) {
      try {
        const fetchedUsername = await userApi.getUsername(user.sub);
        if (fetchedUsername) {
          accountStatsStore.getState().setUsername(fetchedUsername);
        }
      } catch (error) {
        console.error('Failed to load username:', error);
      }
    }
  }

  // code for the START To Modal
  let startMessag = (
    <div className="flex flex-col gap-2 items-center w-full ">
      {/* RETURNING USER - SHOW THEIR CURRENT PROGRESS AT TOP*/}
      {isAuthenticated && user ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-black font-bold text-lg">
            Welcome back, {user.name}!
          </div>
          <div className="flex flex-col gap-2 w-full items-center border-2 border-black rounded-xl m-3 p-2">
            <div className="py-1 gap-2 flex flex-col items-center justify-center bg-green-50 w-full h-full">
              <button
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
                onClick={() => continueGameHandler()}
              >
                Continue where you left off
              </button>
              <div>
                {' '}
                <div className="text-black">
                  You have caught{' '}
                  {
                    userPokemonDetailsFetched.filter(
                      (pokemon) => pokemon.caught
                    ).length
                  }{' '}
                  / 151 Pokemon.
                </div>
              </div>
            </div>
            {/* DIVIDER */}
            <div className="border-2 border-gray w-full px-3 dark:"></div>
            <div className="py-1 gap-2 flex flex-col items-center justify-center bg-orange-50 w-full h-full">
              <button
                className="text-black bg-gray-300 hover:bg-gray-300 w-fit py-1 px-3 border-2 border-black rounded-xl"
                onClick={() => startNewGame()}
              >
                Start a new game
              </button>{' '}
              <div>
                {' '}
                <div className="text-red-500">
                  Warning: This will reset your progress.
                </div>
              </div>
            </div>
          </div>

          <button
            className="text-black bg-blue-300 hover:bg-blue-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </div>
      ) : (
        <a href="/api/auth/login">
          <button
            className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            onClick={() => loginWithRedirect()}
          >
            Log In / Sign Up
          </button>
        </a>
      )}

      {/* <button className="bg-yellow-300 hover:bg-yellow-500 dark:bg-yellow-800 w-fit py-1 px-3 border-2 border-black dark:border-white rounded-xl">Sign Up</button> */}
      {isAuthenticated && user ? (
        ''
      ) : (
        <button
          onClick={handleToggleLoginWithoutAccount}
          className="bg-gray-100 hover:bg-gray-300 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Start without an account
        </button>
      )}

      {/* <button onClick={handleToggleLogin} className="bg-gray-100 hover:bg-gray-300 dark:bg-gray-800 w-fit py-1 px-3 border-2 border-black dark:border-white rounded-xl">Start without an account</button> */}
    </div>
  );
  const [startIsModalOpen, setStartIsModalOpen] = useState(false);

  const StartOpenModal = () => {
    setStartIsModalOpen(true);
  };

  const StartCloseModal = () => {
    setStartIsModalOpen(false);
  };
  return (
    <div className="flex flex-row items-center justify-center gap-6 sm:gap-10">
      <button
        className="startContainer flex flex-col items-center gap-3 hover:cursor-pointer"
        onClick={StartOpenModal}
        data-testid="startButton"
      >
        <Image
          src="/ball.png"
          width={150}
          height={150}
          alt="pokeBall"
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        />
        <div className="uppercase font-bold text-black p-1 rounded text-xl bg-slate-50 w-fit">
          start
        </div>
      </button>
      <button
        className="howContainer flex flex-col items-center gap-3 hover:cursor-pointer"
        onClick={howToOpenModal}
        data-testid="howToButton"
      >
        <Image
          src="/information.png"
          width={150}
          height={150}
          alt="book icon"
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        />
        <div className="uppercase font-bold text-black p-1 rounded text-xl bg-slate-50 w-fit">
          how to
        </div>
      </button>
      <Modal
        open={howToisModalOpen}
        onClose={howToCloseModal}
        content={{
          heading: 'HOW TO PLAY',
          body: bigBody,
          closeMessage: 'Back',
          iconChoice: (
            <Image src="/ball.png" width={150} height={150} alt="pokeBall" />
          ),
        }}
      />
      <Modal
        open={startIsModalOpen}
        onClose={StartCloseModal}
        content={{
          heading:
            isAuthenticated && user
              ? ''
              : 'Sign in to save your progress, or play without an account.',
          body: startMessag,
          closeMessage: 'Close',
          iconChoice: (
            <Image src="/ball.png" width={150} height={150} alt="pokeBall" />
          ),
        }}
      />
    </div>
  );
};

export default StartButtons;
