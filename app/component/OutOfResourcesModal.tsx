'use client';
import Image from 'next/image';
import React from 'react';
import Modal from '../Modal';

interface OutOfResourcesModalProps {
    open: boolean;
    onConfirm: () => void;
    currentScore: number;
}

const OutOfResourcesModal = ({
    open,
    onConfirm,
    currentScore,
}: OutOfResourcesModalProps) => {
    const newScore = Math.floor(currentScore / 2);

    const modalBody = (
        <div className="flex flex-col gap-4 text-left">
            <div className="text-red-600 font-bold text-center text-lg">
                Oh no! You've run out of options!
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="font-semibold text-red-700 mb-2">What happened:</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>All your party Pokémon have fainted</li>
                    <li>You have no money to heal them</li>
                    <li>You have no items to sell or use</li>
                </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="font-semibold text-yellow-700 mb-2">The consequence:</div>
                <div className="text-sm text-gray-700">
                    Your Pokémon will be restored to full health, but your score will be
                    <span className="font-bold text-red-600"> halved</span>.
                </div>
                <div className="mt-2 flex justify-center gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-gray-500">Current Score</div>
                        <div className="font-bold text-lg">{currentScore}</div>
                    </div>
                    <div className="text-center text-2xl">→</div>
                    <div className="text-center">
                        <div className="text-gray-500">New Score</div>
                        <div className="font-bold text-lg text-red-600">{newScore}</div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="font-semibold text-blue-700 mb-2">Tips for next time:</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Keep some money saved for healing</li>
                    <li>Sell items if you need money to heal</li>
                    <li>Don't spend all your money at the shop</li>
                </ul>
            </div>
        </div>
    );

    return (
        <Modal
            open={open}
            onClose={onConfirm} // Clicking close also confirms
            content={{
                heading: 'Game Over - Out of Resources',
                body: modalBody,
                closeMessage: 'Restore Pokémon & Continue',
                logoBGColour: 'bg-red-100',
                logoColour: 'text-red-600',
                iconChoice: (
                    <Image
                        src="/nurseJoyNoBackground.jpg"
                        width={60}
                        height={60}
                        alt="Nurse Joy"
                        className="rounded-full"
                    />
                ),
            }}
        />
    );
};

export default OutOfResourcesModal;
