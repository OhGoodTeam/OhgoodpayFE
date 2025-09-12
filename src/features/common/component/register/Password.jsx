import React from "react";

const Password = ({ handlePassword }) => {
  return (
    <>
      <div className="password-page register-page-component">
        <div className="password-title register-page-component-title">
          <span>비밀번호</span>
        </div>
        <div className="password-input register-page-component-input">
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            onChange={handlePassword}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(Password);
