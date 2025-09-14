import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import arrowIcon from "../assets/img/left_arrow.png";
import "../assets/css/ChatLayout.css";

const ChatLayout = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="chat-layout">
      <Header />
      <div className="chat-subheader">
        <button className="back-button" onClick={handleGoBack}>
          <img src={arrowIcon} alt="뒤로가기" />
        </button>
        <h2 className="chat-title">오레이봉봉과 대화하기</h2>
      </div>
      <main className="chat-main">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLayout;