
import React from 'react';
import Modal from '../../Modal';
import CandyCaneBody from './CandyCaneBody';

const CandyCaneIndex = ({ showCandyCane, setShowCandyCane }: { showCandyCane: boolean, setShowCandyCane: React.Dispatch<React.SetStateAction<boolean>> }) => {

    console.log('Rendering CandyCaneIndex');
    return (
        <>
            {showCandyCane ? (
                <Modal
                    open={showCandyCane}
                    onClose={() => setShowCandyCane(false)}
                    content={{
                        heading: `Choose a Pokemon to Lv up!`,
                        body: <CandyCaneBody />,
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
