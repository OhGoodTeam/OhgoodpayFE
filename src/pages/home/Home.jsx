import "./Home.css";
import QrPinAuthBox from "../../features/home/component/QrPinAuthBox";
import ChatBox from "../../features/home/component/ChatBox";
import WhiteBox from "../../features/home/component/WhiteBox";
import BnplBox from "../../features/home/component/BnplBox";
import QuickAccessBox from "../../features/home/component/QuickAccessBox";
import PayThisMonth from "../../features/recommend/component/dash/PayThisMonth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("accessToken") === null) {
      // navigate("/login");
      return;
    }
    setIsLogin(true);
  }, [isLogin]);

  // const getApi = async () => {
  //   const response = await axiosInstance.get("/api/home");
  //   if (response.status === 200) {
  //     console.log(response.data);
  //   }
  // };

  return (
    <div className="home">
      <div onClick={() => navigate("/qrpin")} className="centered-box">
        <QrPinAuthBox />
      </div>
      <ChatBox />
      {isLogin && <PayThisMonth location="home" />}
      <QuickAccessBox />
    </div>
  );
};

export default Home;
