import { useDispatch, useSelector } from "react-redux";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Popup from "reactjs-popup";

import { setShareModal } from "../../actions/other";
import { URL } from "../../config";

const ShareModal = () => {
  const { isOpen, venue } = useSelector((state) => state.other.shareModal);

  const dispatch = useDispatch();

  const shareUrl = `${URL}/venue/${venue?.uuid}/`;

  return (
    <Popup
      open={isOpen}
      onClose={() =>
        dispatch(
          setShareModal({
            isOpen: false,
          })
        )
      }
      closeOnDocumentClick
    >
      <div className="modal-open modal">
        <div className="modal-box relative">
          <h3 className="mb-4 text-center text-lg font-bold">
            Share venue details to
          </h3>
          <hr />
          <div className="my-5 flex justify-around">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={50} round />
            </FacebookShareButton>
            <WhatsappShareButton url={shareUrl}>
              <WhatsappIcon size={50} round />
            </WhatsappShareButton>
            <FacebookMessengerShareButton url={shareUrl}>
              <FacebookMessengerIcon size={50} round />
            </FacebookMessengerShareButton>
            <TwitterShareButton url={shareUrl}>
              <TwitterIcon size={50} round />
            </TwitterShareButton>
            <EmailShareButton url={shareUrl}>
              <EmailIcon size={50} round />
            </EmailShareButton>
            <TelegramShareButton url={shareUrl}>
              <TelegramIcon size={50} round />
            </TelegramShareButton>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default ShareModal;
