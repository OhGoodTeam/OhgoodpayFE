import "../assets/css/ConfrimedModal.css";
import Button from "./Button";
import {
  useConfirmedModalStore,
  useConfirmedModalTextStore,
} from "../store/ConfirmedModalStore";

const ConfirmedModal = () => {
  const { isOpen, closeConfirmedModal } = useConfirmedModalStore();
  const { text } = useConfirmedModalTextStore();

  const handleRefreshPage = () => {
    closeConfirmedModal();
    window.location.reload();
  };

  return (
    isOpen && (
      <div className="confirmed-modal-overlay">
        <div className="confirmed-modal">
          <div className="confirmed-modal-text">{text}</div>
          <div className="btn-div">
            <Button text="확인" status="positive" onClick={handleRefreshPage} />
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmedModal;
