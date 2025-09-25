import "../assets/css/Header.css";
import logo from "../assets/img/logo_big.png";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineLogin } from "react-icons/ai";
import { useState, useEffect } from "react";
import callToken from "../hook/callToken";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setIsLogin(false);
    sessionStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    navigate("/");
    window.location.reload();
  };

  const handleGetToken = async () => {
    const token = await callToken();
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    handleGetToken();
  }, []); // 의존성 배열을 빈 배열로 변경하여 컴포넌트 마운트 시에만 실행

  // 페이지 포커스 시 토큰 상태 재확인
  useEffect(() => {
    const handleFocus = () => {
      handleGetToken();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <>
      <div className="header">
        <img src={logo} alt="logo" />
        {isLogin === false ? (
          <AiOutlineLogin onClick={handleLogin} />
        ) : (
          <AiOutlineLogout onClick={handleLogout} />
        )}
      </div>
    </>
  );
};

export default Header;
