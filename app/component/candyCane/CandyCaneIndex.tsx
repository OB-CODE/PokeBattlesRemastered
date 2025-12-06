
import React from 'react';
import Modal from '../../Modal';
import CandyCaneBody from './CandyCaneBody';

const CandyCaneIndex = ({ showCandyCane, setShowCandyCane }: { showCandyCane: boolean, setShowCandyCane: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const handleClose = () => setShowCandyCane(false);

    console.log('Rendering CandyCaneIndex');
    return (
        <>
            {showCandyCane ? (
                <Modal
                    open={showCandyCane}
                    onClose={handleClose}
                    content={{
                        heading: `Choose a Pokemon to Lv up!`,
                        body: <CandyCaneBody onUseCandyCane={handleClose} />,
                        closeMessage: 'Keep candy cane',
                        iconChoice: 'candyCaneSVG', // Replace with actual SVG import
                    }}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export default CandyCaneIndex;