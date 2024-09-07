import React, { useEffect } from "react";
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
        const parsedData = JSON.parse(cachedData);
        pokemonDataStore.getState().setPokemonMainArr(parsedData);
        console.log("Using cached data:", parsedData);
      } else {
        // Make API call if no cached data is found
        const response = await fetch("/api/getPokemon");
        const data = await response.json();

        // Store the fetched data in session storage
        sessionStorage.setItem("pokemonData", JSON.stringify(data));

        // Set the data in your Zustand store
        pokemonDataStore.getState().setPokemonMainArr(data);
        console.log("Fetched new data:", data);
      }
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };

  await fetchData();
}
