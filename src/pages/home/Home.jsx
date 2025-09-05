import "./Home.css";
import QrPinAuthBox from "../../features/home/component/QrPinAuthBox";
import ChatBox from "../../features/home/component/ChatBox";
import WhiteBox from "../../features/home/component/WhiteBox";
import BnplBox from "../../features/home/component/bnplBox";
import QuickAccessBox from "../../features/home/component/QuickAccessBox";
const Home = () => {
  return (
    <div className="home">
      <QrPinAuthBox />
      <ChatBox />
      <BnplBox />
      <QuickAccessBox />
    </div>
  );
};

export default Home;
