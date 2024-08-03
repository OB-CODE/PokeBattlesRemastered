import React from "react";

interface BattleScreenProps {
  userIsInBattle: boolean;
  setUserIsInBattle: React.Dispatch<React.SetStateAction<boolean>>;
}

const BattleScreen = ({
  userIsInBattle,
  setUserIsInBattle,
}: BattleScreenProps) => {
  return <div>BattleScreen</div>;
};

export default BattleScreen;
