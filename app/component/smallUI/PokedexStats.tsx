'use client';
import React from 'react';
import userPokemonDetailsStore from '../../../store/userPokemonDetailsStore';

interface OrbProps {
    current: number;
    max: number;
    label: string;
    type: 'seen' | 'caught';
}

const DiabloOrb = ({ current, max, label, type }: OrbProps) => {
    const percentage = (current / max) * 100;

    // Neutral gray background, colored fill
    const colors = type === 'seen'
        ? {
            border: 'border-gray-300',
            bg: 'from-gray-100 to-gray-50',
            fill: 'from-cyan-500 via-cyan-400 to-cyan-300',
            text: 'text-gray-600',
            glow: 'shadow-gray-200/50',
        }
        : {
            border: 'border-gray-300',
            bg: 'from-gray-100 to-gray-50',
            fill: 'from-emerald-500 via-emerald-400 to-emerald-300',
            text: 'text-gray-600',
            glow: 'shadow-gray-200/50',
        };

    return (
        <div className="relative">
            {/* Outer orb container - smaller on mobile */}
            <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 ${colors.border} ${colors.glow} shadow-lg overflow-hidden bg-gradient-to-br ${colors.bg}`}
                title={`${label}: ${current} / ${max}`}
            >
                {/* Fill effect - rises from bottom */}
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors.fill} transition-all duration-500 ease-out opacity-90`}
                    style={{ height: `${percentage}%` }}
                />

                {/* Glass/shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />

                {/* Inner shadow for depth */}
                <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />

                {/* Stats overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className={`text-[8px] sm:text-[9px] font-bold ${colors.text} tracking-wider`}>
                        {label}
                    </div>
                    <div className={`text-lg sm:text-xl font-bold ${colors.text}`}>
                        {current}
                    </div>
                    <div className={`text-[7px] sm:text-[8px] ${colors.text} opacity-70`}>
                        / {max}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PokedexStats = () => {
    const numberOfCaughtPokemon = userPokemonDetailsStore(
        (state) => state.userPokemonData.filter((p) => p.caught).length
    );

    const numberOfSeenPokemon = userPokemonDetailsStore(
        (state) => state.userPokemonData.filter((p) => p.seen).length
    );

    return (
        <div className="flex items-center gap-3">
            <DiabloOrb current={numberOfSeenPokemon} max={151} label="SEEN" type="seen" />
        </div>
    );
};

export default PokedexStats;

// Export the orb component for use elsewhere
export { DiabloOrb };
