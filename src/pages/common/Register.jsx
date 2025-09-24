import "./Register.css";
import { useState } from "react";
import React from "react";
import Account from "../../features/common/component/register/Account";
import BirthDay from "../../features/common/component/register/Birthday";
import Email from "../../features/common/component/register/Email";
import Name from "../../features/common/component/register/Name";
import Password from "../../features/common/component/register/Password";
import Button from "../../shared/components/Button";
import axiosInstance from "../../shared/api/axiosInstance";
import leftArrow from "../../shared/assets/img/left_arrow.png";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [rightEmail, setRightEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [rightPassword, setRightPassword] = useState(false);
  const [name, setName] = useState("");
  const [rightName, setRightName] = useState(false);
  const [birth, setBirth] = useState("");
  const [rightBirth, setRightBirth] = useState(false);
  const [account, setAccount] = useState("");
  const [rightAccount, setRightAccount] = useState(false);
  const [accountName, setAccountName] = useState("국민");

  const navigate = useNavigate();

  const handleEmail = (e) => {
    // 이메일 유효성 검증
    if (e.target.value.length > 0) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(e.target.value)) {
        setRightEmail(false);
        e.target.style.border = "1px solid red";
      } else {
        setRightEmail(true);
        e.target.style.border = "1px solid #ffffff";
      }
    }
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    if (e.target.value.length > 0 || e.target.value.length < 16) {
      const passwordRegex = /^[a-zA-Z0-9!@#.]+$/;
      if (!passwordRegex.test(e.target.value)) {
        setRightPassword(false);
        e.target.style.border = "1px solid red";
      } else {
        setRightPassword(true);
        e.target.style.border = "1px solid #ffffff";
      }
    }
    setPassword(e.target.value);
  };
  const handleName = (e) => {
    setName(e.target.value);
    setRightName(true);
  };
  const handleBirth = (e) => {
    setBirth(e.target.value);
    setRightBirth(true);
  };
  const handleAccount = (e) => {
    setAccount(e.target.value);
    setRightAccount(true);
  };
  const handleAccountName = (e) => {
    setAccountName(e.target.value);
  };

  const handleRegister = async () => {
    if (
      rightName &&
      rightEmail &&
      rightPassword &&
      rightBirth &&
      rightAccount
    ) {
      try {
        const response = await axiosInstance.post("/api/public/register", {
          name: name,
          emailId: email,
          pwd: password,
          birth: birth,
          account: account,
          accountName: accountName,
        });
        if (response.status === 200) {
          alert("회원가입 성공");
          navigate("/login");
        } else {
          alert("회원가입 실패");
        }
      } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
        alert("회원가입 중 오류가 발생했습니다.");
      }
    } else {
      alert("올바른 값을 입력해주세요.");
    }
  };

  const handleLeftArrow = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="register-page">
        <div className="register-page-title">
          <img src={leftArrow} alt="leftArrow" onClick={handleLeftArrow} />
          <span>회원가입</span>
        </div>
        <Name handleName={handleName} />
        <Email handleEmail={handleEmail} />
        <Password handlePassword={handlePassword} />
        <BirthDay birth={birth} handleBirth={handleBirth} />
        <Account
          handleAccount={handleAccount}
          handleAccountName={handleAccountName}
        />
        <div className="register-page-button">
          <Button text="회원가입" status="default" onClick={handleRegister} />
        </div>
      </div>
    </>
  );
};

export default React.memo(Register);
