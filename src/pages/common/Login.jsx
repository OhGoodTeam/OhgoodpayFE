import "./Login.css";
import { useState } from "react";
import React from "react";
import Email from "../../features/common/component/register/Email";
import Password from "../../features/common/component/register/Password";
import Button from "../../shared/components/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../shared/api/axiosInstance";
import leftArrow from "../../shared/assets/img/left_arrow.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [rightEmail, setRightEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [rightPassword, setRightPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmail = (e) => {
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

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth", {
        emailId: email,
        pwd: password,
      });
      const data = response.data;

      if (data && data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
        alert("로그인 성공!");
        navigate("/");
      } else {
        alert("로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleRegister = () => {
    navigate("/register"); // 회원가입 페이지로 이동
  };

  const handleLeftArrow = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-page-title">
        <img src={leftArrow} alt="leftArrow" onClick={handleLeftArrow} />
        <span>로그인</span>
      </div>
      <Email handleEmail={handleEmail} />
      <Password handlePassword={handlePassword} />
      <div className="login-page-button">
        <Button text="로그인" status="positive" onClick={handleLogin} />
        <Button text="회원가입" status="default" onClick={handleRegister} />
      </div>
    </div>
  );
};

export default React.memo(Login);
