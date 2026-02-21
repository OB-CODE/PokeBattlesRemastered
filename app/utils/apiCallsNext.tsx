
import { update } from '@react-spring/web';
import { pokemonDataStore } from '../../store/pokemonDataStore';
import userPokemonDetailsStore from '../../store/userPokemonDetailsStore';
import accountStatsStore from '../../store/accountStatsStore';
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

// Configure the AWS DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamodb = DynamoDBDocumentClient.from(client);

export async function GetAllBasePokemonDetails() {
  const fetchData = async () => {
    try {
      // Check if data is already stored in session storage
      const cachedData = sessionStorage.getItem('pokemonData');

      if (cachedData) {
        // Parse and use the cached data
        let parsedData = JSON.parse(cachedData);
        let updatedParsedData = parsedData.map((pokemon: any) => {
          // create a maxHp based on the hp value
          return {
            ...pokemon,
            maxHp: pokemon.hp, // Ensure maxHp is set to hp
          };
        });

        pokemonDataStore.getState().setPokemonMainArr(updatedParsedData);
        console.log('Using cached data:', updatedParsedData);
      } else {
        // Make API call if no cached data is found
        const response = await fetch('/api/getPokemon');
        const data = await response.json();

        // Store the fetched data in session storage
        sessionStorage.setItem('pokemonData', JSON.stringify(data));

        // Set the data in your Zustand store
        let updatedData = data.map((pokemon: any) => {
          // create a maxHp based on the hp value
          return {
            ...pokemon,
            maxHp: pokemon.hp, // Ensure maxHp is set to hp
          };
        });
        pokemonDataStore.getState().setPokemonMainArr(updatedData);
        console.log('Fetched new data:', updatedData);
      }
    } catch (error) {
      console.error('Error fetching the data:', error);
    }
  };
  await fetchData();
}

export const api = {
  async updatePokemon(
    pokedex_number: number,
    user_id: string,
    updateData: any
  ) {
    try {
      // 1. Update the database via API
      const response = await fetch('/api/updatePokemon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          pokedex_number,
          ...updateData,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update Pokemon');
      }
      // 2. Update the local store
      userPokemonDetailsStore
        .getState()
        .updateUserPokemonData(pokedex_number, updateData);

      return result;
    } catch (error) {
      console.error('Error updating Pokemon:', error);
      throw error;
    }
  },
  // Items
  async getUserItems(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await fetch(`/api/user/items?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user items');
      }

      const data = await response.json();

      // Format the data into a more usable object
      const formattedItems: { [key: string]: number } = {};
      if (data && Array.isArray(data.items)) {
        data.items.forEach((item: { item_id: string; quantity: number }) => {
          formattedItems[item.item_id] = item.quantity;
        });
      }

      return formattedItems;
    } catch (error) {
      console.error('Error getting user items:', error);
      throw error;
    }
  },
  async getUserStats(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await fetch(`/api/user/stats?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user stats');
      }

      const data = await response.json();

      // Format the data into a more usable object
      const formattedItems: { [key: string]: number } = {};
      if (data && Array.isArray(data.items)) {
        data.items.forEach((item: { item_id: string; quantity: number }) => {
          formattedItems[item.item_id] = item.quantity;
        });
      }

      return data.items;
    } catch (error) {
      console.error('Error getting user items:', error);
      throw error;
    }
  },
  async updateUserAccountStats(
    user_id: string,
    stat: 'totalBattles' | 'totalBattlesWon' | 'totalBattlesLost' | "Score",
    value: number
  ) {
    try {
      const response = await fetch('/api/user/updateStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          stat,
          value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user stats');
      }

      return { success: true, message: 'User stats updated successfully' };
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },

  async updateScore(user_id: string, score: number) {
    try {
      const response = await fetch('/api/user/updateStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          stat: 'score',
          value: score,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update score');
      }
      return { success: true, message: 'Score updated successfully' };
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  },

  // Game Run helpers
  async createGameRun(user_id: string, username?: string) {
    try {
      const response = await fetch('/api/user/updateStats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, action: 'create', username }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create game run');
      }
      const data = await response.json();
      return data.runId as string;
    } catch (error) {
      console.error('Error creating game run:', error);
      throw error;
    }
  },

  async updateGameRun(user_id: string, runId: string, score: number) {
    try {
      const response = await fetch('/api/user/updateStats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, action: 'update', runId, score }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update game run');
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating game run:', error);
      throw error;
    }
  },

  async finalizeGameRun(user_id: string, runId: string, finalScore: number) {
    try {
      const response = await fetch('/api/user/updateStats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, action: 'finalize', runId, score: finalScore }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to finalize game run');
      }
      return { success: true };
    } catch (error) {
      console.error('Error finalizing game run:', error);
      throw error;
    }
  },

  async getGameRuns(user_id: string) {
    try {
      const response = await fetch(`/api/user/updateStats?user_id=${encodeURIComponent(user_id)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch game runs');
      }
      const data = await response.json();
      return data.runs as Array<{
        stat: string;
        value: number;
        status: string;
        startedAt: string;
        endedAt?: string;
      }>;
    } catch (error) {
      console.error('Error fetching game runs:', error);
      throw error;
    }
  },

  async getLeaderboard(limit: number = 50) {
    try {
      const response = await fetch(`/api/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leaderboard');
      }
      const data = await response.json();
      return data.leaderboard as Array<{
        rank: number;
        username: string;
        score: number;
        status: string;
        startedAt: string;
        endedAt?: string;
      }>;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  async updateUserItems(
    user_id: string,
    itemName:
      | 'moneyOwned'
      | 'pokeballsOwned'
      | 'goldenPokeballsOwned'
      | 'smallHealthPotionsOwned'
      | 'largeHealthPotionsOwned',
    quantity: number
  ) {
    try {
      const response = await fetch('/api/user/updateItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          item_id: itemName,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update an item');
      }

      return { success: true, message: 'All items updated successfully' };
    } catch (error) {
      console.error('Error updating user items:', error);
      throw error;
    }
  },
};

export const userApi = {
  /**
   * Checks if the accountName is unique and sets it for the user if available.
   * Returns true if set successfully, false if taken or error.
   */
  async checkAndSetAccountName(accountName: string, userId?: string, email?: string) {
    try {
      if (!userId) {
        console.error('User ID is required for checking account name');
        return false;
      }

      const response = await fetch('/api/user/checkAccountName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName,
          user_id: userId,
          email: email ? email.toLowerCase() : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Account name set successfully:', accountName);
        return true;
      } else {
        console.error(data.message || 'Account name already taken');
        return false;
      }
    } catch (error) {
      console.error('Error setting account name:', error);
      return false;
    }
  },
  async checkAndSetUsername(username: string, userId?: string, email?: string, accountName?: string) {
    try {
      if (!userId) {
        console.error('User ID is required for checking username');
        return false;
      }

      const response = await fetch('/api/user/checkUsername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          user_id: userId,
          email: email ? email.toLowerCase() : undefined,
          accountName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Username set successfully:', username);
        return true;
      } else {
        console.error(data.message || 'Username already taken');
        return false;
      }
    } catch (error) {
      console.error('Error setting username:', error);
      return false;
    }
  },

  async getUserProfile(userId: string): Promise<{ username: string | null; accountName: string | null } | null> {
    try {
      // First, check AccountNames table for accountName
      const accountNameRes = await fetch(
        `/api/user/checkAccountName?user_id=${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      let accountName = null;
      if (accountNameRes.ok) {
        const accountData = await accountNameRes.json();
        accountName = accountData.accountName || null;
      }

      // Then, check PokemonUsernames table for username
      const usernameRes = await fetch(
        `/api/user/checkUsername?user_id=${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      let username = null;
      if (usernameRes.ok) {
        const usernameData = await usernameRes.json();
        username = usernameData.username || null;
      }

      return { username, accountName };
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return null;
    }
  },
};
