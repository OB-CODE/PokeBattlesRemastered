'use client';
import React, { SetStateAction, useState, useEffect, useRef, useMemo } from 'react';
import { clearLastBattleAreaOnLogout } from '../../../store/clearLastBattleAreaOnLogout';
import userInBattleStoreFlag from '../../../store/userInBattleStoreFlag';
import userPokemonDetailsStore from '../../../store/userPokemonDetailsStore';
import { usePartySelectionStore } from '../../../store/partySelectionStore';
import { pokemonDataStore } from '../../../store/pokemonDataStore';
import { itemsStore } from '../../../store/itemsStore';
import { returnMergedPokemon } from '../../utils/pokemonToBattleHelpers';
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
            const timer = setTimeout(() => setIsPulsing(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [current]);

    const colors = type === 'seen'
        ? {
            outerRing: 'from-gray-400 via-gray-300 to-gray-400',
            innerBg: 'from-gray-200 via-gray-100 to-gray-200',
            fill: 'from-cyan-400 via-cyan-500 to-cyan-600',
            fillGlow: 'cyan',
            text: 'text-gray-600',
            textShadow: '',
            label: 'text-gray-500',
            pulseGlow: 'shadow-[0_0_45px_18px_rgba(34,211,238,0.6)]',
            ring: 'ring-cyan-400',
        }
        : {
            outerRing: 'from-gray-400 via-gray-300 to-gray-400',
            innerBg: 'from-gray-200 via-gray-100 to-gray-200',
            fill: 'from-emerald-400 via-emerald-500 to-emerald-600',
            fillGlow: 'emerald',
            text: 'text-gray-600',
            textShadow: '',
            label: 'text-gray-500',
            pulseGlow: 'shadow-[0_0_45px_18px_rgba(52,211,153,0.6)]',
            ring: 'ring-emerald-400',
        };

    return (
        <div className="flex flex-col items-center z-[0]">
            {/* Outer metallic ring */}
            <div
                className={`
                    relative rounded-full p-[3px] sm:p-1
                    bg-gradient-to-br ${colors.outerRing}
                    shadow-lg
                    ${isPulsing ? `ring-4 ${colors.ring} ${colors.pulseGlow} scale-105` : ''}
                    transition-all duration-300
                `}
            >
                {/* Inner orb container */}
                <div
                    className={`
                        relative rounded-full overflow-hidden
                        w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28
                        bg-gradient-to-br ${colors.innerBg}
                        shadow-[inset_0_4px_20px_rgba(0,0,0,0.15)]
                    `}
                >
                    {/* Liquid fill effect */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors.fill} transition-all duration-700 ease-out`}
                        style={{
                            height: `${percentage}%`,
                            boxShadow: `0 -4px 20px 4px rgba(${colors.fillGlow === 'cyan' ? '34,211,238' : '52,211,153'}, 0.4)`,
                        }}
                    >
                        {/* Animated wave effect on liquid surface */}
                        <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 bg-gradient-to-b from-white/30 to-transparent" />
                    </div>

                    {/* Glass reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-white/30 blur-[2px]" />

                    {/* Inner shadow for depth */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_-4px_15px_rgba(0,0,0,0.3)]" />

                    {/* Number and /max */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-lg sm:text-3xl lg:text-4xl font-bold ${colors.text} ${colors.textShadow} leading-none`}>{current}</span>
                        <span className={`text-[8px] sm:text-sm lg:text-base ${colors.text} opacity-80 leading-none`}>/{max}</span>
                    </div>
                </div>
            </div>
            {/* Label below orb */}
            <span className={`text-[9px] sm:text-sm lg:text-base font-bold ${colors.label} uppercase tracking-wider mt-0.5 sm:mt-1 drop-shadow-sm`}>
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
    pulse?: 'none' | 'slight' | 'low' | 'medium' | 'high' | 'critical';
}

const LabeledButton = ({ onClick, icon, label, variant, disabled = false, pulse = 'none' }: LabeledButtonProps) => {
    // Fixed width to prevent size changes when label changes (e.g., Party/Dex)
    const baseStyles = "flex flex-col items-center justify-center gap-0.5 rounded-lg shadow-sm transition-all duration-200 w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16";

    const variantStyles = {
        primary: "bg-gradient-to-b from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white",
        yellow: "bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-orange-500 text-black",
        gray: "bg-gradient-to-b from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white",
    };

    const disabledStyles = "opacity-40 cursor-not-allowed grayscale";
    const enabledStyles = "hover:scale-105 active:scale-95";

    // Pulse styles for health indicator - 5 tiers based on % health lost
    const pulseStyles = {
        none: "",
        slight: "shadow-[0_0_10px_4px_rgba(239,68,68,0.5)] ring-2 ring-red-400",           // 20% lost
        low: "shadow-[0_0_12px_5px_rgba(239,68,68,0.55)] ring-2 ring-red-400",             // 40% lost
        medium: "animate-pulse shadow-[0_0_14px_6px_rgba(239,68,68,0.6)] ring-2 ring-red-500", // 60% lost
        high: "animate-pulse shadow-[0_0_15px_6px_rgba(239,68,68,0.65)] ring-3 ring-red-500",  // 80% lost
        critical: "animate-bounce-glow ring-4 ring-red-600 brightness-110", // 100% lost (fainted) - bounces with bright glow
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : enabledStyles} ${pulse !== 'none' ? pulseStyles[pulse] : ''}`}
        >
            <span className="w-6 h-6 sm:w-6 sm:h-6 lg:w-7 lg:h-7 [&>svg]:w-full [&>svg]:h-full [&>div]:w-full [&>div]:h-full">{icon}</span>
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-semibold leading-tight">{label}</span>
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
    const battleOver = userInBattleStoreFlag((state) => state.battleOver);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Get player's money
    const moneyOwned = itemsStore((state) => state.moneyOwned);

    // Money animation state
    const [moneyAnimation, setMoneyAnimation] = useState<'none' | 'increase' | 'decrease'>('none');
    const [moneyDiff, setMoneyDiff] = useState<number>(0);
    const prevMoneyRef = useRef(moneyOwned);

    // Trigger animation when money changes
    useEffect(() => {
        if (moneyOwned !== prevMoneyRef.current) {
            const diff = moneyOwned - prevMoneyRef.current;
            setMoneyDiff(diff);
            setMoneyAnimation(diff > 0 ? 'increase' : 'decrease');
            prevMoneyRef.current = moneyOwned;

            const timer = setTimeout(() => {
                setMoneyAnimation('none');
                setMoneyDiff(0);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [moneyOwned]);

    // Check if buttons should be disabled (either in battle or explicitly disabled)
    const buttonsDisabled = userIsInBattle || disabled;

    // Get Pokemon stats for the orbs
    const numberOfCaughtPokemon = userPokemonDetailsStore(
        (state) => state.userPokemonData.filter((p) => p.caught).length
    );
    const numberOfSeenPokemon = userPokemonDetailsStore(
        (state) => state.userPokemonData.filter((p) => p.seen).length
    );

    // Get currently viewed Pokemon's health for Heal button pulse
    const currentPartyIndex = usePartySelectionStore((state) => state.currentIndex);
    const userPokemonData = userPokemonDetailsStore((state) => state.userPokemonData);
    const pokemonBaseData = pokemonDataStore((state) => state.pokemonMainArr);

    // Get merged Pokemon data (includes level-adjusted hp/maxHp)
    const mergedPokemonData = useMemo(() => {
        return returnMergedPokemon();
    }, [userPokemonData, pokemonBaseData]);

    // Calculate heal button pulse based on current Pokemon's health
    const getHealButtonPulse = (): 'none' | 'slight' | 'low' | 'medium' | 'high' | 'critical' => {
        // Get party Pokemon (in party, caught, active)
        const partyPokemon = mergedPokemonData.filter(p => p.inParty && p.caught && p.active !== false);
        if (partyPokemon.length === 0 || currentPartyIndex >= partyPokemon.length) return 'none';

        const currentPokemon = partyPokemon[currentPartyIndex];
        if (!currentPokemon) return 'none';

        const currentHp = currentPokemon.hp;
        const maxHp = currentPokemon.maxHp;

        if (maxHp <= 0) return 'none';

        const healthPercent = (currentHp / maxHp) * 100;

        // 5 tiers based on health percentage remaining
        if (currentHp <= 0) return 'critical';      // 0% - fainted
        if (healthPercent <= 20) return 'high';     // 1-20% remaining (80%+ lost)
        if (healthPercent <= 40) return 'medium';   // 21-40% remaining (60%+ lost)
        if (healthPercent <= 60) return 'low';      // 41-60% remaining (40%+ lost)
        if (healthPercent <= 80) return 'slight';   // 61-80% remaining (20%+ lost)
        return 'none';                               // 81-100% remaining (less than 20% lost)
    };

    const healButtonPulse = getHealButtonPulse();

    const handleMenuAction = (action: () => void) => {
        action();
        setShowMobileMenu(false);
    };

    return (
        <div className="flex flex-col w-full h-full relative">
            {/* Money Display - Top Right Corner */}
            <div className={`
                fixed top-2 right-4 z-[999] px-2 py-1 rounded-full shadow-md flex items-center gap-1
                transition-all duration-300
                ${moneyAnimation === 'increase'
                    ? 'bg-gradient-to-r from-green-400 to-green-500 scale-110 shadow-[0_0_12px_4px_rgba(34,197,94,0.5)]'
                    : moneyAnimation === 'decrease'
                        ? 'bg-gradient-to-r from-red-400 to-red-500 scale-110 shadow-[0_0_12px_4px_rgba(239,68,68,0.5)]'
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500'}
            `}>
                <span className={`z-[100] text-sm transition-transform duration-300 ${moneyAnimation !== 'none' ? 'animate-bounce' : ''}`}>💰</span>
                <span className="text-xs sm:text-sm font-bold text-gray-800">{moneyOwned.toLocaleString()}</span>
                {/* Floating diff indicator */}
                {moneyAnimation !== 'none' && (
                    <span className={`
                        absolute -top-4 right-0 text-xs font-bold
                        animate-fade-up
                        ${moneyAnimation === 'increase' ? 'text-green-600' : 'text-red-600'}
                    `}>
                        {moneyAnimation === 'increase' ? '+' : ''}{moneyDiff.toLocaleString()}
                    </span>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col justify-center items-center relative z-0">
                {children}
            </div>

            {/* Mobile Menu Popup */}
            {showMobileMenu && (
                <div className="sm:hidden fixed inset-0 z-[5] flex items-end justify-end pointer-events-none">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 pointer-events-auto"
                        onClick={() => setShowMobileMenu(false)}
                    />
                    {/* Menu */}
                    <div className="relative m-4 mb-6 pointer-events-auto animate-fadeIn"
                        style={{ minWidth: '80vw', maxWidth: 340 }}>
                        <div className="bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 border-4 border-yellow-400 rounded-3xl shadow-2xl p-1">
                            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-yellow-300">
                                <span className="font-bold text-lg text-yellow-800 drop-shadow">Menu</span>
                                <button
                                    onClick={() => setShowMobileMenu(false)}
                                    className="p-2 hover:bg-yellow-100 rounded-full transition"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="py-2 flex flex-col gap-2">
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
                                        clearLastBattleAreaOnLogout();
                                        handleToggleLogin?.();
                                        logoutWithRedirect?.();
                                    })}
                                    icon={<LogoutIcon />}
                                    label="Logout"
                                />
                            </div>
                        </div>
                        {/* Safe area padding for devices with home indicator */}
                        <div className="h-4" />
                    </div>
                </div>
            )}

            {/* Persistent Bottom Shell - minimal height, orbs overlap */}
            <div className={`relative z-[1] transition-opacity duration-300 pointer-events-none ${battleOver ? 'opacity-40' : ''}`}>
                {/* Thin border bar at very bottom */}
                <div className="hidden absolute bottom-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200" />
                {/* Content that overlaps the bar */}
                <div className="relative flex items-end justify-between px-2 pb-1">

                    {/* Left side: Orb + Game buttons */}
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <CompactOrb current={numberOfSeenPokemon} max={151} label="SEEN" type="seen" />

                        {(!userIsInBattle || !battleTypeChosen) && (
                            <div className="flex items-center gap-1">
                                <LabeledButton
                                    onClick={() => setShowPokedex?.(!showPokedex)}
                                    icon={showPokedex ? <PartyIcon /> : <PokedexIcon />}
                                    label={showPokedex ? 'Party' : 'Dex'}
                                    variant="yellow"
                                    disabled={disabled || userIsInBattle}
                                />
                                <LabeledButton
                                    onClick={() => setShowHealPokemon?.(true)}
                                    icon={<HealIcon />}
                                    label="Heal"
                                    variant="primary"
                                    disabled={disabled}
                                    pulse={healButtonPulse}
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
                    </div>

                    {/* Right side: Account buttons + Orb */}
                    <div className="flex items-center gap-2 pointer-events-auto">
                        {/* Desktop: Show all buttons */}
                        {(!userIsInBattle || !battleTypeChosen) && (
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
                                        clearLastBattleAreaOnLogout();
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
                        {(!userIsInBattle || !battleTypeChosen) && (
                            <button
                                onClick={disabled ? undefined : () => setShowMobileMenu(true)}
                                disabled={disabled}
                                className={`sm:hidden flex flex-col items-center justify-center gap-0.5 rounded-lg shadow-sm bg-gradient-to-b from-gray-400 to-gray-500 text-white w-8 h-8 ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
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
