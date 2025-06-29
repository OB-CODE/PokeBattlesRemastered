import React from "react";
import Modal from "../../Modal";
import { IinfoForAccount } from "../../GameMainPage";
import Image from "next/image";
import AccountBody from "./AccountBody";
import accountStatsStore from "../../../store/accountStatsStore";

const AccountIndex = (infoForAccount: IinfoForAccount) => {
  const { isViewingAccount, setIsViewingAccount } = infoForAccount;

  const usersUsername = accountStatsStore((state) => state.username);

  return (
    <>
      {isViewingAccount ? (
        <Modal
          open={isViewingAccount}
          onClose={() => setIsViewingAccount(false)}
          content={{
            heading: `${usersUsername}'s Account`,
            body: <AccountBody />,
            closeMessage: "Return to game",
            iconChoice: (
              <Image
                src={"/EarlyBacksprite.png"}
                width={500}
                height={500}
                alt="Trainer back and backpack"
              />
            ),
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default AccountIndex;
