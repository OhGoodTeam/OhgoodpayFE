import "./Home.css";
import QrPinAuthBox from "../../features/home/component/QrPinAuthBox";
import ChatBox from "../../features/home/component/ChatBox";
import WhiteBox from "../../features/home/component/WhiteBox";
import BnplBox from "../../features/home/component/bnplBox";
import QuickAccessBox from "../../features/home/component/QuickAccessBox";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div onClick={() => navigate("/qrpin")} className="centered-box">
        <QrPinAuthBox />
      </div>
      <ChatBox />
      <BnplBox />
      <QuickAccessBox />
    </div>
  );
};

export default Home;
