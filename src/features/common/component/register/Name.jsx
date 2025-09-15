import React from "react";

const Name = ({ handleName }) => {
  return (
    <>
      <div className="name-page register-page-component">
        <div className="name-title register-page-component-title">
          <span>이름</span>
        </div>
        <div className="name-input register-page-component-input">
          <input
            type="text"
            placeholder="이름을 입력해주세요."
            onChange={handleName}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(Name);
