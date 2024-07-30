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

export function GetAllBasePokemonDetails() {
  const fetchData = async () => {
    try {
      const response = await fetch("/api/getPokemon");
      const data = await response.json();
      pokemonDataStore.getState().setPokemonMainArr(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };

  fetchData();

  //   return <div>GetAllBasePokemonDetails</div>;
}
