import React from "react";
import "react-datepicker/dist/react-datepicker.css";
const BirthDay = ({ birth, handleBirth }) => {
  return (
    <>
      <div className="birth-day-page register-page-component">
        <div className="birth-day-title register-page-component-title">
          <span>생년월일</span>
        </div>
        <div className="birth-day-input register-page-component-input">
          <input
            type="date"
            placeholder="생년월일을 입력해주세요."
            onChange={handleBirth}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(BirthDay);
