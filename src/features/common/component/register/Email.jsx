import React from "react";

const Email = ({ handleEmail }) => {
  return (
    <>
      <div className="email-page register-page-component">
        <div className="email-title register-page-component-title">
          <span>이메일</span>
        </div>
        <div className="email-input register-page-component-input">
          <input
            type="email"
            placeholder="이메일을 입력해주세요."
            onChange={handleEmail}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(Email);
