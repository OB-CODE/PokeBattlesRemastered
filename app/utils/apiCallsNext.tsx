import { update } from "@react-spring/web";
import { pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

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
      const cachedData = sessionStorage.getItem("pokemonData");

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
        console.log("Using cached data:", updatedParsedData);
      } else {
        // Make API call if no cached data is found
        const response = await fetch("/api/getPokemon");
        const data = await response.json();

        // Store the fetched data in session storage
        sessionStorage.setItem("pokemonData", JSON.stringify(data));

        // Set the data in your Zustand store
        let updatedData = data.map((pokemon: any) => {
          // create a maxHp based on the hp value
          return {
            ...pokemon,
            maxHp: pokemon.hp, // Ensure maxHp is set to hp
          };
        });
        pokemonDataStore.getState().setPokemonMainArr(updatedData);
        console.log("Fetched new data:", updatedData);
      }
    } catch (error) {
      console.error("Error fetching the data:", error);
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
      const response = await fetch("/api/updatePokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          pokedex_number,
          ...updateData,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update Pokemon");
      }
      // 2. Update the local store
      userPokemonDetailsStore
        .getState()
        .updateUserPokemonData(pokedex_number, updateData);

      return result;
    } catch (error) {
      console.error("Error updating Pokemon:", error);
      throw error;
    }
  },
  // Items
  async getUserItems(userId: string) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await fetch(`/api/user/items?user_id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user items");
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
      console.error("Error getting user items:", error);
      throw error;
    }
  },
  async updateUserAccountStats(
    user_id: string,
    stat: "totalBattles" | "battlesWon" | "battlesLost" | "highestPokemonLevel",
    value: number
  ) {
    try {
      const response = await fetch("/api/user/updateStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          stat,
          value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user stats");
      }

      return { success: true, message: "User stats updated successfully" };
    } catch (error) {
      console.error("Error updating user stats:", error);
      throw error;
    }
  },

  async updateUserItems(
    user_id: string,
    itemName:
      | "moneyOwned"
      | "pokeballsOwned"
      | "goldenPokeballsOwned"
      | "smallHealthPotionsOwned"
      | "largeHealthPotionsOwned",
    quantity: number
  ) {
    try {
      const response = await fetch("/api/user/updateItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          item_id: itemName,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update an item");
      }

      return { success: true, message: "All items updated successfully" };
    } catch (error) {
      console.error("Error updating user items:", error);
      throw error;
    }
  },
};
