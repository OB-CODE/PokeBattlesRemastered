import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "./utils/apiCallsNext";
import accountStatsStore from "../store/accountStatsStore";

interface IStat {
  value: number;
  stat:
    | "totalBattles"
    | "totalPokemonCaught"
    | "totalPokemonSeen"
    | "totalBattlesWon"
    | "totalBattlesLost";
  user_id: string;
  lastUpdated: Date;
}

const AccountStatTrigger = () => {
  const { user } = useAuth0();

  useEffect(() => {
    // Perform the initial fetch to retrieve user items
    const fetchUserItems = async () => {
      if (!user || !user.sub) return;

      try {
        const response = await api.getUserStats(user.sub);
        // Set the items in the zustand store]
        if (response) {
          let isTotalBattles = response.filter(
            (obj: IStat) => obj.stat === "totalBattles"
          );
          if (isTotalBattles.length > 0) {
            accountStatsStore
              .getState()
              .setTotalBattles(isTotalBattles[0].value);
          }
          //   accountStatsStore
          //     .getState()
          //     .setTotalBattles(response.totalBattles ?? 0);
          accountStatsStore
            .getState()
            .setTotalPokemonCaught(response.totalPokemonCaught ?? 0);
          accountStatsStore
            .getState()
            .setTotalPokemonSeen(response.totalPokemonSeen ?? 0);
          accountStatsStore
            .getState()
            .setTotalBattlesWon(response.totalBattlesWon ?? 0);
          accountStatsStore
            .getState()
            .setTotalBattlesLost(response.totalBattlesLost ?? 0);
        }
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    };
    fetchUserItems();
    // setHasRetrievedItems(true);
  }, []);

  return <div>AccountStatTrigger</div>;
};

export default AccountStatTrigger;
