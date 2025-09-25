import "../../css/mypage/Mypoint.css";
import React from "react";
import pointIcon from "../../../../shared/assets/img/point.png";

const Mypoint = ({ point }) => {
  return (
    <>
      <div className="mypoint-page">
        <div className="mypoint-title">
          <div className="mypoint-title-icon">
            <img src={pointIcon} />
            <span>포인트</span>
          </div>
          <span>{point} P</span>
        </div>
      </div>
    </>
  );
};

export default React.memo(Mypoint);
