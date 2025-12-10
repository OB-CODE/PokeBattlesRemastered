'use client';
import Image from 'next/image';
import React from 'react';
import Modal from '../Modal';

interface GameWonModalProps {
    open: boolean;
    onClose: () => void;
    finalScore: number;
    rank: string;
}

const GameWonModal = ({
    open,
    onClose,
    finalScore,
    rank,
}: GameWonModalProps) => {
    const modalBody = (
        <div className="flex flex-col gap-4 text-center">
            <div className="text-3xl">🎉🏆🎉</div>

            <div className="text-yellow-600 font-bold text-2xl animate-pulse">
                Congratulations, Pokémon Master!
            </div>

            <div className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 border-2 border-yellow-400 rounded-xl p-4 shadow-lg">
                <div className="text-lg text-gray-700 mb-2">
                    You have caught all <span className="font-bold text-blue-600">151 Pokémon</span>!
                </div>
                <div className="text-sm text-gray-600">
                    You've completed the Pokédex and proven yourself to be a true Pokémon Master.
                </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-gray-500 text-sm">Your Final Score</div>
                <div className="font-bold text-4xl text-purple-600 my-2">
                    {finalScore.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                    Rank: <span className="font-semibold text-purple-700">{rank}</span>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="font-semibold text-blue-700 mb-2">🌟 What's Next?</div>
                <ul className="text-sm text-gray-700 space-y-1 text-left">
                    <li>• Not much really, I didn't think I would see you here. </li>
                    <li>• Try to increase your score even higher</li>
                </ul>
            </div>

            <div className="text-gray-500 text-xs italic mt-2">
                "I knew you could do it! You're the very best, like no one ever was!"
                <br />— Professor Oak
            </div>
        </div>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            content={{
                heading: '🏆 YOU DID IT! 🏆',
                body: modalBody,
                closeMessage: 'Continue Playing',
                logoBGColour: 'bg-yellow-100',
                logoColour: 'text-yellow-600',
                iconChoice: (
                    <Image
                        src="/ball.png"
                        width={60}
                        height={60}
                        alt="Pokeball"
                        className="animate-bounce mt-8"
                    />
                ),
            }}
        />
    );
};

export default GameWonModal;
