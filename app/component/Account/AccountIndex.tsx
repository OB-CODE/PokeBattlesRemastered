import React from "react";
import Modal from "../../Modal";
import { IinfoForAccount } from "../../GameMainPage";
import Image from "next/image";
import AccountBody from "./AccountBody";

const AccountIndex = (infoForAccount: IinfoForAccount) => {
  const { isViewingAccount, setIsViewingAccount } = infoForAccount;
  return (
    <>
      {isViewingAccount ? (
        <Modal
          open={isViewingAccount}
          onClose={() => setIsViewingAccount(false)}
          content={{
            heading: `Your Account`,
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
