import React from "react";

const EmptyShortsList = () => {
  return (
    <div className="empty-shorts-container">
      <div className="empty-shorts-content">
        <div className="empty-shorts-character">{/* img */}</div>
        <div className="empty-shorts-text">
          <h2 className="empty-title">쇼츠 피드가 텅 비어있어요!</h2>
          <p className="empty-description">
            영상을 올려 다른 사람들과 공유해보세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyShortsList;
