import React from "react";
import Modal from "../../Modal";
import { IinfoForAccount, IinfoForScore } from "../../GameMainPage";
import Image from "next/image";
import accountStatsStore from "../../../store/accountStatsStore";
import ScoreDisplay from "./ScoreDisplay";
import ModalWide from "../../ModalWide";

const ScoreIndex = (infoForScore: IinfoForScore) => {
  const { isViewingScore, setIsViewingScore } = infoForScore;

  const usersUsername = accountStatsStore((state) => state.username);

  return (
    <>
      {isViewingScore ? (
        <ModalWide
          open={isViewingScore}
          onClose={() => setIsViewingScore(false)}
          content={<ScoreDisplay />}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ScoreIndex;
