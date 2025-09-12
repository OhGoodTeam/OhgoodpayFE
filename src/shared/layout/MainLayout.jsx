import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/qrpin" || location.pathname === "/register"; // /qrpin 또는 /register이면 Footer 숨김

  return (
    <div className="main-layout">
      <Header />
      <Outlet />
      {!hideFooter && <Footer />} {/* 조건부 렌더링 */}
    </div>
  );
};

export default MainLayout;
