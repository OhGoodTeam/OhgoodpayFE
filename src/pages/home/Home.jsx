import "./Home.css";
import QrPinAuthBox from "../../features/home/component/QrPinAuthBox";
import ChatBox from "../../features/home/component/ChatBox";
import WhiteBox from "../../features/home/component/WhiteBox";
import BnplBox from "../../features/home/component/BnplBox";
import QuickAccessBox from "../../features/home/component/QuickAccessBox";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("accessToken") === null) {
      // navigate("/login");
    }
  }, []);

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
      <BnplBox />
      <QuickAccessBox />
    </div>
  );
};

export default Home;
