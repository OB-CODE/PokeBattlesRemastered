'use client';
import React, { SetStateAction } from 'react';
import userInBattleStoreFlag from '../../../store/userInBattleStoreFlag';
import PokedexStats from '../smallUI/PokedexStats';
import { backpackSCG, shopSVG } from '../../utils/UI/svgs';
import {
    blueButton,
    blueButtonSmall,
    silverButton,
    yellowButton,
} from '../../utils/UI/UIStrings';

interface GameShellProps {
    children: React.ReactNode;
    showPokedex: boolean;
    setShowPokedex: React.Dispatch<SetStateAction<boolean>>;
    setShowHealPokemon: React.Dispatch<SetStateAction<boolean>>;
    setShowShop: React.Dispatch<SetStateAction<boolean>>;
    setShowBackpack: React.Dispatch<SetStateAction<boolean>>;
    setIsViewingAccount: React.Dispatch<SetStateAction<boolean>>;
    setIsViewingScore: React.Dispatch<SetStateAction<boolean>>;
    handleToggleLogin: () => void;
    logoutWithRedirect: () => void;
    battleTypeChosen: boolean;
    setUserIsInBattle: (value: boolean) => void;
}

const GameShell = ({
    children,
    showPokedex,
    setShowPokedex,
    setShowHealPokemon,
    setShowShop,
    setShowBackpack,
    setIsViewingAccount,
    setIsViewingScore,
    handleToggleLogin,
    logoutWithRedirect,
    battleTypeChosen,
    setUserIsInBattle,
}: GameShellProps) => {
    const userIsInBattle = userInBattleStoreFlag((state) => state.userIsInBattle);

    return (
        <div className="flex flex-col w-full h-full">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col items-center">
                {children}
            </div>

            {/* Persistent Bottom Shell - Console-like UI */}
            <div className="border-t-4 border-black bg-gradient-to-b from-gray-200 to-gray-300 px-4 py-3 shadow-inner">
                <div className="flex items-center justify-between gap-4 max-w-full flex-wrap sm:flex-nowrap">
                    {/* Left Section: Pokedex Stats Bubbles */}
                    <div className="flex items-center gap-4 min-w-fit">
                        <PokedexStats />
                    </div>

                    {/* Center Section: Main Action Buttons */}
                    <div className="flex-1 flex items-center justify-center gap-2 flex-wrap min-w-fit">
                        {!userIsInBattle ? (
                            <>
                                {/* Toggle Pokedex/Party */}
                                <button
                                    className={`${yellowButton} min-w-[100px] sm:min-w-[120px]`}
                                    onClick={() => setShowPokedex(!showPokedex)}
                                >
                                    {showPokedex ? 'PARTY' : 'POKEDEX'}
                                </button>

                                {/* Heal Button */}
                                <button
                                    onClick={() => setShowHealPokemon(true)}
                                    className={`${blueButton} min-w-[80px] sm:min-w-[100px]`}
                                    title="Heal your Pokemon"
                                >
                                    HEAL
                                </button>

                                {/* Shop Button */}
                                <button
                                    onClick={() => setShowShop(true)}
                                    className={blueButtonSmall}
                                    title="Shop"
                                >
                                    <div className="flex justify-center items-center h-10 w-10">
                                        {shopSVG}
                                    </div>
                                </button>

                                {/* Backpack Button */}
                                <button
                                    onClick={() => setShowBackpack(true)}
                                    className={blueButtonSmall}
                                    title="Backpack"
                                >
                                    <div className="flex justify-center items-center h-10 w-10">
                                        {backpackSCG}
                                    </div>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Battle Mode - Limited Options */}
                                {!battleTypeChosen && (
                                    <button
                                        className={yellowButton}
                                        onClick={() => setUserIsInBattle(false)}
                                    >
                                        BACK
                                    </button>
                                )}
                                {battleTypeChosen && (
                                    <div className="text-gray-500 font-bold text-sm italic">
                                        Battle in Progress...
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Section: Account & System Buttons */}
                    <div className="flex items-center gap-2 min-w-fit flex-wrap sm:flex-nowrap">
                        <button
                            onClick={() => setIsViewingScore(true)}
                            className={`${blueButton} min-w-[70px] sm:min-w-[80px] text-xs sm:text-sm`}
                            title="Check your score"
                        >
                            SCORE
                        </button>

                        <button
                            onClick={() => setIsViewingAccount(true)}
                            className={`${blueButton} min-w-[80px] sm:min-w-[90px] text-xs sm:text-sm`}
                            title="View account"
                        >
                            ACCOUNT
                        </button>

                        <button
                            onClick={() => {
                                handleToggleLogin();
                                logoutWithRedirect();
                            }}
                            className={`${silverButton} text-xs sm:text-sm`}
                            title="Logout"
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameShell;
