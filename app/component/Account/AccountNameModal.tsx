import React, { useState } from 'react';
import { Filter } from 'bad-words';

interface AccountNameModalProps {
    isOpen: boolean;
    onSubmit: (name: string) => void;
    onClose?: () => void;
}

const AccountNameModal: React.FC<AccountNameModalProps> = ({ isOpen, onSubmit, onClose }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation: length, allowed chars
        if (!/^\w{3,16}$/.test(name)) {
            setError('Name must be 3-16 letters, numbers, or underscores.');
            return;
        }
        const filter = new Filter();
        if (filter.isProfane(name)) {
            setError('That name is not allowed.');
            return;
        }
        onSubmit(name);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl border-4 border-yellow-400 max-w-xs w-full p-6 relative animate-fadeIn">
                <h2 className="text-xl font-bold text-yellow-800 mb-2">Choose Your Account Name</h2>
                <p className="text-sm text-gray-700 mb-4">This name will be public, must be unique, and cannot be changed later.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
                        placeholder="Enter account name"
                        maxLength={16}
                        autoFocus
                    />
                    {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-orange-500 text-black font-bold py-2 rounded-lg shadow-md transition"
                    >
                        Set Name
                    </button>
                </form>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default AccountNameModal;
