import { IbackpackInfo } from '../../GameMainPage';
import Modal from '../../Modal';
import { backpackSCG } from '../../utils/UI/svgs';
import BackpackBody from './BackpackBody';

const BackpackIndex = (backPackInfo: IbackpackInfo) => {
  const { showBackPack, setShowBackpack } = backPackInfo;
  return (
    <>
      {showBackPack ? (
        <Modal
          open={showBackPack}
          onClose={() => setShowBackpack(false)}
          content={{
            heading: `Your Belongings`,
            body: <BackpackBody />,
            closeMessage: 'Stop rummaging',
            iconChoice: backpackSCG,
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default BackpackIndex;
