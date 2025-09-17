import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import '../assets/css/DashboardLayout.css';
import arrowIcon from "../assets/img/left_arrow.png";

const DashboardLayout = () => {
  const navigate = useNavigate(); // navigate 훅 사용

  const handleGoBack = () => { // 함수 정의 추가
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-subheader">
        <button className="back-button" onClick={handleGoBack}>
          <img src={arrowIcon} alt="뒤로가기" />
        </button>
        <h2 className="dashboard-title">오굿 리포트</h2>
      </div>
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;