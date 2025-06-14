"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { loggedStore } from "../store/userLogged";
import userPokemonDetailsStore, {
  IUserPokemonData,
} from "../store/userPokemonDetailsStore";
import Modal from "./Modal";
//Trigger build again

import { useAuth0 } from "@auth0/auth0-react";

const StartButtons = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  let userPokemonDetailsFetched: IUserPokemonData[] = [];

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      // fetch(`/api/getUsersPokemonStats? user_id=${encodeURIComponent(user.sub)}`)
      fetch(`/api/getUsersPokemonStats?user_id=${encodeURIComponent(user.sub)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            console.log(data);
            // pass in the correct user data.
            userPokemonDetailsFetched = data as IUserPokemonData[];
          } else {
            // If no data is returned, set the user Pokemon details to default.
            setUserPokemonDetailsToDefault(user.sub);
          }
        });
    }
  }, [isAuthenticated, user]);

  const loggedState = loggedStore((state) => state.loggedIn);
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);

  function setUserPokemonDetailsToDefault(userId?: string) {
    // If userId is provided, use it; otherwise call the API without it
    const fetchData = async () => {
      try {
        // have 2 fetch calls, one for the user id and one for the default data.
        if (userId) {
          const response = await fetch(
            `/api/createNewUserPokemonDetails?user_id=${encodeURIComponent(userId)}`
          );
          const data = await response.json();
          userPokemonDetailsStore.getState().setUserPokemonData(data.message);
          return;
        }
        const response = await fetch("/api/createNewUserPokemonDetails");
        const data = await response.json();
        userPokemonDetailsStore.getState().setUserPokemonData(data.message);
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    };
    fetchData();
  }

  const handleToggleLoginWithoutAccount = () => {
    toggleLoggedState();
    setUserPokemonDetailsToDefault();
  };

  // code for the How To Modal
  let bigBody = (
    <div className="flex flex-col gap-3">
      <div>
        Signing up allows you to keep your progress. You can still play on a
        without a log in, you will just lose your progress when you leave the
        page.
      </div>
      <div>Your goal is to catch all 151 original Pokemon. </div>
      <div>
        Injuring a Pokemon will increase the chance you have of catching it.
        Injuring it too much will make it faint and give your Pokemon
        experience.
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

  const howToOpenModal = () => {
    setHowToIsModalOpen(true);
  };

  const howToCloseModal = () => {
    setHowToIsModalOpen(false);
  };

  function continueGameHandler() {
    // Logic to continue the game
    console.log("Continuing the game...");
    toggleLoggedState();
    if (userPokemonDetailsFetched.length > 0) {
      userPokemonDetailsStore
        .getState()
        .setUserPokemonData(userPokemonDetailsFetched);
    }

    setUserPokemonDetailsToDefault(user?.sub);
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
                {" "}
                <div className="text-black">
                  You have caught {"XXX"} out off 151 Pokemon.
                </div>
              </div>
            </div>
            {/* DIVIDER */}
            <div className="border-2 border-gray w-full px-3 dark:"></div>
            <div className="py-1 gap-2 flex flex-col items-center justify-center bg-orange-50 w-full h-full">
              <button
                className="text-black bg-gray-300 hover:bg-gray-300 w-fit py-1 px-3 border-2 border-black rounded-xl"
                onClick={() => loginWithRedirect()}
              >
                Start a new game
              </button>{" "}
              <div>
                {" "}
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
        ""
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
    <div className="flex flex-col md:flex-row items-center md:justify-between w-[50%] gap-3">
      <button
        className="startContainer flex flex-col items-center gap-3 hover:cursor-pointer"
        onClick={StartOpenModal}
        data-testid="startButton"
      >
        <Image src="/ball.png" width={150} height={150} alt="pokeBall" />
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
        />
        <div className="uppercase font-bold text-black p-1 rounded text-xl bg-slate-50 w-fit">
          how to
        </div>
      </button>
      <Modal
        open={howToisModalOpen}
        onClose={howToCloseModal}
        content={{
          heading: "HOW TO PLAY",
          body: bigBody,
          closeMessage: "Back",
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
              ? ""
              : "Sign in to save your progress, or play without an account.",
          body: startMessag,
          closeMessage: "Close",
          iconChoice: (
            <Image src="/ball.png" width={150} height={150} alt="pokeBall" />
          ),
        }}
      />
    </div>
  );
};

export default StartButtons;
