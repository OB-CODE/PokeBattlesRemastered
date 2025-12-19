'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const [userPokemonDetailsFetched, setUserPokemonDetailsFetched] = useState<IUserPokemonData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const userPokemonZustand = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  // Move Zustand hook call to top level
  const resetCollapsedLocations = useCollapsedLocationsStore(
    (state) => state.resetCollapsedLocations
  );

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      setIsLoading(true);
      setProgress(0);
      if (progressInterval.current) clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + Math.floor(Math.random() * 7) + 3 : prev));
      }, 120);
      fetch(`/api/getUsersPokemonStats?user_id=${encodeURIComponent(user.sub)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setUserPokemonDetailsFetched(data);
          } else {
            setUserPokemonDetailsToDefault(user.sub);
          }
        })
        .finally(() => {
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
            if (progressInterval.current) clearInterval(progressInterval.current);
          }, 400);
        });
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
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
      <div>Take pokemon to battle to catch more.</div>


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
          {/* <li>Switch to healthy Pokemon during battle</li> */}
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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
        <p>
          TIP: Leveling up a pokemon too fast might not be the best idea - you need to catch weak pokemon too.         </p>
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

  async function startNewGame() {
    // Logic to start a new game for a logged-in user
    startNewGameScoringZustand();
    resetCollapsedLocations();

    // If user is logged in, reset their data in the backend
    if (user && user.sub) {
      try {
        // Call your backend API to reset user data
        const response = await fetch(`/api/createNewUserPokemonDetails?user_id=${encodeURIComponent(user.sub)}`, {
          method: 'POST',
        });
        const data = await response.json();
        if (data && data.message) {
          userPokemonDetailsStore.getState().setUserPokemonData(data.message);
          setUserPokemonDetailsFetched(data.message);
        }
      } catch (error) {
        console.error('Error resetting user data:', error);
      }
    } else {
      // Not logged in, just reset to default
      setUserPokemonDetailsToDefault();
    }

    // Also reset logged state and set hasFirstPokemon to false so user is sent to username selection
    loggedStore.getState().changeLoggedState();
    // Explicitly set hasFirstPokemon to false
    if (loggedStore.getState().hasPokemon) {
      loggedStore.getState().toggleHasFirstPokemon();
    }

    console.log('Starting a new game...');
  }

  const howToOpenModal = () => {
    setHowToIsModalOpen(true);
  };

  const howToCloseModal = () => {
    setHowToIsModalOpen(false);
  };

  const router = useRouter();
  async function continueGameHandler() {
    setIsLoading(true);
    setProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.floor(Math.random() * 7) + 3 : prev));
    }, 120);
    try {
      toggleLoggedState();
      if (userPokemonDetailsFetched.length > 0) {
        userPokemonDetailsStore.getState().setUserPokemonData(userPokemonDetailsFetched);
        loggedStore.getState().toggleHasFirstPokemon();
      }
      setUserPokemonDetailsToDefault(user?.sub);
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
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
      }, 400);
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex flex-col items-center gap-2 w-full">
                    <div className="w-40 h-5 bg-gray-200 border border-black rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-green-500 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center text-xs font-bold text-black">
                        {progress}%
                      </div>
                    </div>
                    <span>Loading your Pokémon...</span>
                  </span>
                ) : (
                  'Continue where you left off'
                )}
              </button>
              <div>
                <div className="text-black">
                  You have caught{' '}
                  {userPokemonDetailsFetched.filter((pokemon) => pokemon.caught).length} / 151 Pokemon.
                </div>
              </div>
            </div>
            {/* DIVIDER */}
            <div className="border-2 border-gray w-full px-3 dark:"></div>
            <div className="py-1 gap-2 flex flex-col items-center justify-center bg-orange-50 w-full h-full">
              <button
                className="text-black bg-gray-300 hover:bg-gray-300 w-fit py-1 px-3 border-2 border-black rounded-xl"
                onClick={() => startNewGame()}
                disabled={isLoading}
              >
                Start a new game
              </button>{' '}
              <div>
                <div className="text-red-500">
                  Warning: This will reset your progress.
                </div>
              </div>
            </div>
          </div>
          <button
            className="text-black bg-blue-300 hover:bg-blue-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            disabled={isLoading}
          >
            Log Out
          </button>
        </div>
      ) : (
        <button
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
          onClick={() => loginWithRedirect()}
        >
          Log In / Sign Up
        </button>
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
