import React, { useEffect, useState } from "react";
import { battleLogStore } from "../../../../store/battleLogStore";

const BattleOverCard = ({ winner }: { winner: string }) => {
  const battleStoreMessageLog = battleLogStore((state) => state.messageLog);
  let lastMessage = battleStoreMessageLog[battleStoreMessageLog.length - 1];

  const [inputWinnerMessage, setInputWinnerMessage] = useState<string>("");

  useEffect(() => {
    if (lastMessage.includes("won")) {
      setInputWinnerMessage(lastMessage);
    }
  }, [lastMessage]);

  return (
    <div className="h-full w-fit flex items-center justify-center relative">
      {inputWinnerMessage != "" ? (
        <div
          className={`p-4 ${winner == "player" ? "bg-green-500" : "bg-orange-400"} border w-[400px] absolute top-[50%] left-[50%] whitespace-nowrap translate-x-[-50%] translate-y-[-50%] text-center`}>
          <div> The Battle Is Over</div>
          <div>{inputWinnerMessage}</div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BattleOverCard;
