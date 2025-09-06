import "../css/ExtensionModal.css";
import Button from "../../../shared/components/Button";
import axiosInstance from "../../../shared/api/axiosInstance";
import {
  useConfirmedModalStore,
  useConfirmedModalTextStore,
} from "../../../shared/store/ConfirmedModalStore";
import { useExtensionModalStore } from "../../../shared/store/ExtensionModalStore";
const ExtensionModal = ({ customerId, extension, firstMonth }) => {
  const { openExtensionModal, closeExtensionModal } = useExtensionModalStore();
  const { openConfirmedModal, closeConfirmedModal } = useConfirmedModalStore();
  const { text, setText } = useConfirmedModalTextStore();
  const handleExtension = () => {
    if (extension) {
      setText("이미 연장 신청되었습니다.");
      openConfirmedModal();
      closeExtensionModal();
    } else {
      getApi();
      setText("연장 신청되었습니다.");
      openConfirmedModal();
      closeExtensionModal();
    }
  };

  const getApi = async () => {
    const response = await axiosInstance.post(
      "/api/payment/extension/" + customerId
    );
  };

  return (
    <>
      <div className="extension-modal-overlay">
        <div className="extension-modal">
          <div className="extension-modal-title">
            <span>납부 연장 신청</span>
            <input type="button" value="X" onClick={closeExtensionModal} />
          </div>
          <div className="extension-modal-info">
            <span>{firstMonth}월 납부 기한이 말일까지 연장됩니다.</span>
            <span>* 납부 연장 신청은 매달 1회만 가능합니다.</span>
          </div>
          <div className="extension-modal-button">
            <Button
              text="연장 신청"
              status="negative"
              onClick={handleExtension}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExtensionModal;
