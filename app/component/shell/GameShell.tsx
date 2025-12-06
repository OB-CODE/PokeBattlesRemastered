'use client';
import React, { SetStateAction, useState, useEffect, useRef } from 'react';
import userInBattleStoreFlag from '../../../store/userInBattleStoreFlag';
import userPokemonDetailsStore from '../../../store/userPokemonDetailsStore';
import { backpackSCG, shopSVG } from '../../utils/UI/svgs';

interface GameShellProps {
    children: React.ReactNode;
    showPokedex?: boolean;
    setShowPokedex?: React.Dispatch<SetStateAction<boolean>>;
    setShowHealPokemon?: React.Dispatch<SetStateAction<boolean>>;
    setShowShop?: React.Dispatch<SetStateAction<boolean>>;
    setShowBackpack?: React.Dispatch<SetStateAction<boolean>>;
    setIsViewingAccount?: React.Dispatch<SetStateAction<boolean>>;
    setIsViewingScore?: React.Dispatch<SetStateAction<boolean>>;
    handleToggleLogin?: () => void;
    logoutWithRedirect?: () => void;
    battleTypeChosen?: boolean;
    setUserIsInBattle?: (value: boolean) => void;
    disabled?: boolean; // New prop to disable all buttons
}

// SVG Icons for compact buttons
const PokedexIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm8 3a7 7 0 100 14 7 7 0 000-14zm0 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
);

const PartyIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);

const HealIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
);

const ScoreIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const AccountIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
);

const BackIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
);

const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
);

// Compact Orb with label below
interface CompactOrbProps {
    current: number;
    max: number;
    label: string;
    type: 'seen' | 'caught';
}

const CompactOrb = ({ current, max, label, type }: CompactOrbProps) => {
    const percentage = (current / max) * 100;
    const [isPulsing, setIsPulsing] = useState(false);
    const prevCount = useRef(current);

    // Trigger pulse animation when count changes
    useEffect(() => {
        if (current !== prevCount.current) {
            setIsPulsing(true);
            prevCount.current = current;
            const timer = setTimeout(() => setIsPulsing(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [current]);

    const colors = type === 'seen'
        ? {
            border: 'border-orange-400',
            bg: 'from-orange-100 to-orange-50',
            fill: 'from-orange-500 to-orange-300',
            text: 'text-orange-700',
            label: 'text-orange-600',
            glow: 'shadow-orange-400',
            ring: 'ring-orange-400',
        }
        : {
            border: 'border-green-400',
            bg: 'from-green-100 to-green-50',
            fill: 'from-green-500 to-green-300',
            text: 'text-green-700',
            label: 'text-green-600',
            glow: 'shadow-green-400',
            ring: 'ring-green-400',
        };

    return (
        <div className="flex flex-col items-center">
            {/* Orb with number and /max inside - bigger on desktop */}
            <div
                className={`
                    relative rounded-full border-2 shadow-md overflow-hidden bg-gradient-to-br
                    w-12 h-12 sm:w-24 sm:h-24 lg:w-28 lg:h-28
                    ${colors.border} ${colors.bg}
                    ${isPulsing ? `animate-pulse ring-4 ${colors.ring} shadow-lg ${colors.glow}` : ''}
                    transition-all duration-300
                `}
            >
                {/* Fill effect */}
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors.fill} transition-all duration-500 ease-out opacity-80`}
                    style={{ height: `${percentage}%` }}
                />
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent" />
                {/* Number and /max */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-base sm:text-3xl lg:text-4xl font-bold ${colors.text} leading-none`}>{current}</span>
                    <span className={`text-[8px] sm:text-sm lg:text-base ${colors.text} opacity-70 leading-none`}>/{max}</span>
                </div>
            </div>
            {/* Label below orb */}
            <span className={`text-[9px] sm:text-sm lg:text-base font-bold ${colors.label} uppercase tracking-wide mt-0.5 sm:mt-1`}>
                {label}
            </span>
        </div>
    );
};

// Labeled button component - more compact
interface LabeledButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    variant: 'primary' | 'yellow' | 'gray';
    disabled?: boolean;
}

const LabeledButton = ({ onClick, icon, label, variant, disabled = false }: LabeledButtonProps) => {
    // Fixed width to prevent size changes when label changes (e.g., Party/Dex)
    const baseStyles = "flex flex-col items-center justify-center gap-0.5 rounded-lg shadow-sm transition-all duration-200 w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16";

    const variantStyles = {
        primary: "bg-gradient-to-b from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white",
        yellow: "bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-orange-500 text-black",
        gray: "bg-gradient-to-b from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white",
    };

    const disabledStyles = "opacity-40 cursor-not-allowed grayscale";
    const enabledStyles = "hover:scale-105 active:scale-95";

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : enabledStyles}`}
        >
            <span className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 [&>svg]:w-full [&>svg]:h-full [&>div]:w-full [&>div]:h-full">{icon}</span>
            <span className="text-[8px] sm:text-[10px] lg:text-xs font-semibold leading-tight">{label}</span>
        </button>
    );
};

// Menu item for popup
interface MenuItemProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const MenuItem = ({ onClick, icon, label }: MenuItemProps) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-100 active:bg-gray-200 transition-colors"
    >
        <span className="text-gray-600">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
);

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
    disabled = false,
}: GameShellProps) => {
    const userIsInBattle = userInBattleStoreFlag((state) => state.userIsInBattle);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Check if buttons should be disabled (either in battle or explicitly disabled)
    const buttonsDisabled = userIsInBattle || disabled;

    // Get Pokemon stats for the orbs
    const numberOfCaughtPokemon = userPokemonDetailsStore(
        (state) => state.userPokemonData.filter((p) => p.caught).length
    );
    const numberOfSeenPokemon = userPokemonDetailsStore(
        (state) => state.userPokemonData.filter((p) => p.seen).length
    );

    const handleMenuAction = (action: () => void) => {
        action();
        setShowMobileMenu(false);
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col items-center">
                {children}
            </div>

            {/* Mobile Menu Popup */}
            {showMobileMenu && (
                <div className="sm:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowMobileMenu(false)}
                    />
                    {/* Menu */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <span className="font-semibold text-gray-700">Menu</span>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="py-2">
                            <MenuItem
                                onClick={() => handleMenuAction(() => setIsViewingScore?.(true))}
                                icon={<ScoreIcon />}
                                label="Check Score"
                            />
                            <MenuItem
                                onClick={() => handleMenuAction(() => setIsViewingAccount?.(true))}
                                icon={<AccountIcon />}
                                label="My Account"
                            />
                            <MenuItem
                                onClick={() => handleMenuAction(() => {
                                    handleToggleLogin?.();
                                    logoutWithRedirect?.();
                                })}
                                icon={<LogoutIcon />}
                                label="Logout"
                            />
                        </div>
                        {/* Safe area padding for devices with home indicator */}
                        <div className="h-6" />
                    </div>
                </div>
            )}

            {/* Persistent Bottom Shell - minimal height, orbs overlap */}
            <div className="relative">
                {/* Thin border bar at very bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200" />
                {/* Content that overlaps the bar */}
                <div className="relative flex items-end justify-between px-2 pb-1">

                    {/* Left side: Orb + Game buttons */}
                    <div className="flex items-center gap-2">
                        <CompactOrb current={numberOfSeenPokemon} max={151} label="SEEN" type="seen" />

                        {!userIsInBattle && (
                            <div className="flex items-center gap-1">
                                <LabeledButton
                                    onClick={() => setShowPokedex?.(!showPokedex)}
                                    icon={showPokedex ? <PartyIcon /> : <PokedexIcon />}
                                    label={showPokedex ? 'Party' : 'Dex'}
                                    variant="yellow"
                                    disabled={disabled}
                                />
                                <LabeledButton
                                    onClick={() => setShowHealPokemon?.(true)}
                                    icon={<HealIcon />}
                                    label="Heal"
                                    variant="primary"
                                    disabled={disabled}
                                />
                                <LabeledButton
                                    onClick={() => setShowShop?.(true)}
                                    icon={<div className="w-5 h-5 flex items-center justify-center">{shopSVG}</div>}
                                    label="Shop"
                                    variant="primary"
                                    disabled={disabled}
                                />
                                <LabeledButton
                                    onClick={() => setShowBackpack?.(true)}
                                    icon={<div className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">{backpackSCG}</div>}
                                    label="Bag"
                                    variant="primary"
                                    disabled={disabled}
                                />
                            </div>
                        )}

                        {userIsInBattle && !battleTypeChosen && (
                            <LabeledButton
                                onClick={() => setUserIsInBattle?.(false)}
                                icon={<BackIcon />}
                                label="Back"
                                variant="yellow"
                            />
                        )}

                        {userIsInBattle && battleTypeChosen && (
                            <div className="text-gray-500 font-bold text-xs italic flex items-center gap-1 px-2">
                                <span className="animate-pulse">⚔️</span>
                                Battle...
                            </div>
                        )}
                    </div>

                    {/* Right side: Account buttons + Orb */}
                    <div className="flex items-center gap-2">
                        {/* Desktop: Show all buttons */}
                        {!userIsInBattle && (
                            <div className="hidden sm:flex items-center gap-1">
                                <LabeledButton
                                    onClick={() => setIsViewingScore?.(true)}
                                    icon={<ScoreIcon />}
                                    label="Score"
                                    variant="primary"
                                    disabled={disabled}
                                />
                                <LabeledButton
                                    onClick={() => setIsViewingAccount?.(true)}
                                    icon={<AccountIcon />}
                                    label="Me"
                                    variant="primary"
                                    disabled={disabled}
                                />
                                <LabeledButton
                                    onClick={() => {
                                        handleToggleLogin?.();
                                        logoutWithRedirect?.();
                                    }}
                                    icon={<LogoutIcon />}
                                    label="Out"
                                    variant="gray"
                                    disabled={disabled}
                                />
                            </div>
                        )}

                        {/* Mobile: Show menu button */}
                        {!userIsInBattle && (
                            <button
                                onClick={disabled ? undefined : () => setShowMobileMenu(true)}
                                disabled={disabled}
                                className={`sm:hidden flex flex-col items-center justify-center gap-0.5 rounded-lg shadow-sm bg-gradient-to-b from-gray-400 to-gray-500 text-white w-10 h-10 ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                            >
                                <MenuIcon />
                                <span className="text-[8px] font-semibold leading-tight">More</span>
                            </button>
                        )}

                        <CompactOrb current={numberOfCaughtPokemon} max={151} label="CAUGHT" type="caught" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameShell;
