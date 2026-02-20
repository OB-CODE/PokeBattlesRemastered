import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { userApi } from '../../utils/apiCallsNext';
import accountStatsStore from '../../../store/accountStatsStore';


interface UsernameInputProps {
  setUsernameChosen: React.Dispatch<React.SetStateAction<string>>;
}


const UsernameInput = ({ setUsernameChosen }: UsernameInputProps) => {
  const { user } = useAuth0();
  const [inputValue, setInputValue] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'accountName' | 'username'>('accountName');
  const MAX_LENGTH = 15;
  const [isLoading, setIsLoading] = useState(false);

  const setAccountUsername = accountStatsStore((state) => state.setUsername);
  // Optionally, add setAccountName to your store for global access
  function onUsernameSaved() {
    setAccountUsername(inputValue);
  }
  // On mount, check if logged-in user already has an accountName
  React.useEffect(() => {
    const checkProfile = async () => {
      if (user?.sub) {
        const profile = await userApi.getUserProfile(user.sub);
        if (profile && profile.accountName) {
          setAccountName(profile.accountName);
          setStep('username');
        } else {
          setStep('accountName');
        }
      } else {
        setStep('username'); // For guests
      }
    };
    checkProfile();
  }, [user]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.slice(0, MAX_LENGTH);
    if (step === 'accountName') {
      setAccountName(newValue);
    } else {
      setInputValue(newValue);
    }
    setError('');
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (step === 'accountName') {
      const name = accountName.trim();
      if (!name) {
        setError('Please enter an account name');
        return;
      }
      setIsLoading(true);
      try {
        if (user?.sub) {
          const success = await userApi.checkAndSetAccountName(
            name,
            user.sub,
            user.email ? user.email.toLowerCase() : undefined
          );
          if (success) {
            setStep('username');
          } else {
            setError('This account name is already taken or could not be saved');
          }
        } else {
          setStep('username'); // For guests, skip accountName
        }
      } catch (err) {
        setError('Failed to save account name. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Username step
    const username = inputValue.trim();
    if (!username) {
      setError('Please enter a username');
      return;
    }
    setIsLoading(true);
    try {
      if (user?.sub) {
        // Always include accountName when setting username for new games
        const profile = await userApi.getUserProfile(user.sub);
        const accountNameToUse = profile && profile.accountName ? profile.accountName : accountName;
        const success = await userApi.checkAndSetUsername(
          username,
          user.sub,
          user.email ? user.email.toLowerCase() : undefined,
          accountNameToUse // Pass accountName to backend
        );
        if (success) {
          setUsernameChosen(username);
          if (onUsernameSaved) {
            onUsernameSaved();
          }
        } else {
          setError("This username is already taken or couldn't be saved");
        }
      } else {
        setUsernameChosen(username);
        if (onUsernameSaved) {
          onUsernameSaved();
        }
      }
    } catch (err) {
      setError('Failed to save username. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <div className="flex flex-col gap-2 w-full max-w-md p-4 border-2 border-gray-100 rounded-lg bg-white shadow-md">
        {step === 'accountName' ? (
          <>
            <div>First, choose your account name (one-time only):</div>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col gap-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    className={`border pl-2 py-1 border-black w-full ${error ? 'border-red-500' : ''}`}
                    placeholder="Account Name..."
                    value={accountName}
                    onChange={handleInputChange}
                    maxLength={MAX_LENGTH}
                    disabled={isLoading}
                  />
                  <div className="absolute flex justify-center items-center right-2 top-2 text-xs text-gray-500">
                    {accountName.length}/{MAX_LENGTH}
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Checking...' : 'Continue'}
                </button>
              </div>
            </form>
            <div className="text-sm text-gray-600 mt-2">
              Please choose a unique account name (max {MAX_LENGTH} characters). This will be used for all your high scores and is only set once.
            </div>
          </>
        ) : (
          <>
            <div>What should we call you for this run?</div>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col gap-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    className={`border pl-2 py-1 border-black w-full ${error ? 'border-red-500' : ''}`}
                    placeholder="Username..."
                    value={inputValue}
                    onChange={handleInputChange}
                    maxLength={MAX_LENGTH}
                    disabled={isLoading}
                  />
                  <div className="absolute flex justify-center items-center right-2 top-2 text-xs text-gray-500">
                    {inputValue.length}/{MAX_LENGTH}
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Checking...' : 'Continue'}
                </button>
              </div>
            </form>
            <div className="text-sm text-gray-600 mt-2">
              Please choose a unique username (max {MAX_LENGTH} characters). If the name is linked to your account, you CAN use it again.
            </div>
            <div className="text-sm text-gray-600">See you in the high scores!</div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsernameInput;
