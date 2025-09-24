import React, { useState } from "react";
import "../../../../features/shorts/css/ShareModal.css";

const ShareModal = ({ isOpen, onClose, shortsId }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `http://localhost:5173/shorts/feeds?shortsId=${shortsId}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>링크 공유</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="share-url-container">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="share-url-input"
          />
          <button
            className={`copy-button ${copied ? "copied" : ""}`}
            onClick={handleCopyUrl}
          >
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>

        <div className="share-modal-footer">
          <p className="share-description">
            링크를 복사하여 친구들과 공유하세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
