import React from "react";
const Account = ({ handleAccount, handleAccountName }) => {
  return (
    <>
      <div className="account-page register-page-component">
        <div className="account-title register-page-component-title">
          <span>계좌</span>
        </div>
        <div className="account-input register-page-component-input">
          <input
            type="text"
            placeholder="계좌를 입력해주세요."
            onChange={handleAccount}
          />
        </div>
        <div className="account-name-input register-page-component-select">
          <select onChange={handleAccountName}>
            <option value="국민">국민</option>
            <option value="기업">기업</option>
            <option value="카카오">카카오</option>
            <option value="하나">하나</option>
            <option value="우리">우리</option>
            <option value="신한">신한</option>
            <option value="토스">토스</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default React.memo(Account);
