"use client";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { loggedStore } from "../store/userLogged";
import { constructionToast } from "./utils/helperfn";



const StartButtons = () => {

  const loggedState = loggedStore((state) => state.loggedIn)
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState)

  const handleToggleLogin = () => {
    toggleLoggedState()
        }

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

  const howToOpenModal = () => {
    setHowToIsModalOpen(true);
  };

  const howToCloseModal = () => {
    setHowToIsModalOpen(false);
  };

    // code for the START To Modal
  let startMessag = (
    <div className="flex flex-col gap-2 items-center w-full ">
      {/* <button className="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-800 w-fit py-1 px-3 border-2 border-black dark:border-white rounded-xl">Log In</button> */}
      <button className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl" onClick={constructionToast}>Log In </button>
      {/* <button className="bg-yellow-300 hover:bg-yellow-500 dark:bg-yellow-800 w-fit py-1 px-3 border-2 border-black dark:border-white rounded-xl">Sign Up</button> */}
      <button className="bg-yellow-300 hover:bg-yellow-500  w-fit py-1 px-3 border-2 border-black  rounded-xl" onClick={constructionToast}>Sign Up</button>
      <button onClick={handleToggleLogin} className="bg-gray-100 hover:bg-gray-300 w-fit py-1 px-3 border-2 border-black rounded-xl">Start without an account</button>
      {/* <button onClick={handleToggleLogin} className="bg-gray-100 hover:bg-gray-300 dark:bg-gray-800 w-fit py-1 px-3 border-2 border-black dark:border-white rounded-xl">Start without an account</button> */}
    </div>
  )
  const [startIsModalOpen, setStartIsModalOpen] = useState(false);

  const StartOpenModal = () => {
    setStartIsModalOpen(true);
  };

  const StartCloseModal = () => {
    setStartIsModalOpen(false);
  };
  return (
    <div className="flex flex-col md:flex-row items-center md:justify-between w-[50%] gap-3">
      <div
        className="startContainer flex flex-col items-center gap-3 hover:cursor-pointer"
        onClick={StartOpenModal}
      >
        <Image src="/ball.png" width={150} height={150} alt="pokeBall" />
        <div className="uppercase font-bold text-black p-1 rounded text-xl bg-slate-50 w-fit">
          start
        </div>
      </div>
      <div
        className="howContainer flex flex-col items-center gap-3 hover:cursor-pointer"
        onClick={howToOpenModal}
        data-type="primary"
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
      </div>
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
      <Modal open={startIsModalOpen} onClose={StartCloseModal} content={{ heading: "Sign in to save your progress, or play without an account.", body: startMessag, closeMessage: "Close", iconChoice: <Image
        src="/ball.png"
        width={150}
        height={150}
        alt="pokeBall"
      /> }}/>
    </div>
  );
};

export default StartButtons;
