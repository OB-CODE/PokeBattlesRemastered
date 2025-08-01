import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { userApi } from "../../utils/apiCallsNext";
import accountStatsStore from "../../../store/accountStatsStore";

interface UsernameInputProps {
  setUsernameChosen: React.Dispatch<React.SetStateAction<string>>;
}

const UsernameInput = ({ setUsernameChosen }: UsernameInputProps) => {
  const { user } = useAuth0();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const MAX_LENGTH = 15;
  const [isLoading, setIsLoading] = useState(false);

  const setAccountUsername = accountStatsStore((state) => state.setUsername);
  function onUsernameSaved() {
    setAccountUsername(inputValue);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Limit input to MAX_LENGTH characters
    const newValue = event.target.value.slice(0, MAX_LENGTH);
    setInputValue(newValue);
    setError(""); // Clear any previous errors
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const username = inputValue.trim();
    if (!username) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);

    try {
      if (user?.sub) {
        // Pass the user ID as a parameter
        const success = await userApi.checkAndSetUsername(
          username,
          user.sub,
          user.email ? user.email.toLowerCase() : undefined
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
        // Handle guest users
        setUsernameChosen(username);
        if (onUsernameSaved) {
          onUsernameSaved();
        }
      }
    } catch (err) {
      setError("Failed to save username. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <div className="flex flex-col gap-2 w-full max-w-md p-4 border-2 border-gray-100 rounded-lg bg-white shadow-md">
        <div>First, What should we call you?</div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-2">
            <div className="relative w-full">
              <input
                type="text"
                className={`border pl-2 py-1 border-black w-full ${error ? "border-red-500" : ""}`}
                placeholder="Name..."
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
              className={`
                bg-blue-500 
                hover:bg-blue-600 
                text-white 
                py-1 
                px-4 
                rounded
                mt-2
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Continue"}
            </button>
          </div>
        </form>
        <div className="text-sm text-gray-600 mt-2">
          Please choose a unique name (max {MAX_LENGTH} characters). If the name
          is linked to your account, you CAN use it again.
        </div>
        <div className="text-sm text-gray-600">See you in the high scores!</div>
      </div>
    </div>
  );
};

export default UsernameInput;
