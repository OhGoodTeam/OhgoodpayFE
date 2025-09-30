import WhiteBox from "./WhiteBox";
import Button from "../../../shared/components/Button";
import "../css/ChatBox.css";
import ray1 from "../../../shared/assets/img/ray1.png";
import { useNavigate } from "react-router-dom";

const ChatBox = () => {
  const navigate = useNavigate();
  const handleChat = () => {
    navigate("/chat");    
  };

  return (
    <WhiteBox className="chat-box">
      <img src={ray1} alt="Ray1 Icon" className="ray1-icon" />
      <div className="chat-content">
        오굿페이의 오레이봉봉입니다! <br /> 오늘도 좋은하루 되세요🩵
      </div>
      <Button text="채팅하기" status="positive" onClick={handleChat} />
    </WhiteBox>
  );
};

export default ChatBox;
