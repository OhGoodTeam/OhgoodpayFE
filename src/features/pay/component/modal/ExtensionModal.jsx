import "../../css/modal/ExtensionModal.css";
import Button from "../../../../shared/components/Button";
import axiosInstance from "../../../../shared/api/axiosInstance";
import {
  useConfirmedModalStore,
  useConfirmedModalTextStore,
} from "../../../../shared/store/ConfirmedModalStore";
import { useExtensionModalStore } from "../../../../shared/store/ExtensionModalStore";
import React from "react";

const ExtensionModal = ({ customerId, extension, firstYearMonth }) => {
  const { openExtensionModal, closeExtensionModal } = useExtensionModalStore();
  const {
    openConfirmedModal,
    openConfirmedModalWithRefresh,
    closeConfirmedModal,
  } = useConfirmedModalStore();
  const { text, setText } = useConfirmedModalTextStore();
  const handleExtension = () => {
    if (firstYearMonth === null) {
      setText("연장 신청이 불가능 합니다.");
      openConfirmedModal();
      closeExtensionModal();
      return;
    }
    if (extension) {
      setText("이미 연장 신청되었습니다.");
      openConfirmedModal();
      closeExtensionModal();
    } else if (
      firstYearMonth ===
      new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
    ) {
      setText("연장 신청이 불가능 합니다.");
      openConfirmedModal();
      closeExtensionModal();
    } else {
      getApi();
    }
  };

  const getApi = async () => {
    const response = await axiosInstance.post(
      `/api/payment/extension`
    );
    if (response.status === 200) {
      setText("연장 신청되었습니다.");
      openConfirmedModalWithRefresh();
      closeExtensionModal();
    } else {
      setText("연장 신청에 실패했습니다.");
      openConfirmedModal();
      closeExtensionModal();
    }
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
            <span>
              {firstYearMonth ? firstYearMonth.toString().substring(5, 7) : "0"}
              월 납부 기한이 말일까지 연장됩니다.
            </span>
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

export default React.memo(ExtensionModal);
