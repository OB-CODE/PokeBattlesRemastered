"use client";
import React from 'react';
import Modal from '../../Modal';
import { IinfoForAccount } from '../../GameMainPage';
import Image from 'next/image';
import AccountBody from './AccountBody';
import accountStatsStore from '../../../store/accountStatsStore';
import { useAuth0 } from '@auth0/auth0-react';

const AccountIndex = (infoForAccount: IinfoForAccount) => {
  const { isViewingAccount, setIsViewingAccount } = infoForAccount;
  const { user, } = useAuth0();


  return (
    <>
      {isViewingAccount ? (
        <Modal
          open={isViewingAccount}
          onClose={() => setIsViewingAccount(false)}
          content={{
            heading: user?.name ? `${user?.name}'s Account` : "Not logged in",
            body: <AccountBody />,
            closeMessage: 'Return to game',
            iconChoice: (
              <Image
                src={'/EarlyBacksprite.png'}
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
