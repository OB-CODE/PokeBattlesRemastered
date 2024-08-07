import React from "react";
import Wilderness from "./battleLocations/Wilderness";
import Tournament from "./Tournament";

const BattleGroundsChosen = ({ battleLocation }) => {
  function returnComponentToLoad() {
    if (battleLocation == "Wilderness") {
      return <Wilderness />; //
    } else {
      // return <Tournament />;
    }
  }

  return <div className="h-full w-full">{returnComponentToLoad()}</div>;
};

export default BattleGroundsChosen;
