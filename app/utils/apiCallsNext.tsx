import { pokemonDataStore } from "../../store/pokemonDataStore";
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
