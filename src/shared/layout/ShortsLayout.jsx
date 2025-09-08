import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ShortsHeader from "../components/ShortsHeader";
import Footer from "../components/Footer";

const ShortsLayout = () => {
  const location = useLocation();
  const isUploadPage = location.pathname === "/shorts/upload";

  useEffect(() => {
    // CSS 파일을 동적으로 로드
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/src/features/shorts/css/style.css";
    link.id = "shorts-css";

    document.head.appendChild(link);

    // 컴포넌트 언마운트 시 CSS 제거
    return () => {
      const existingLink = document.getElementById("shorts-css");
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  return (
    <>
      <ShortsHeader />
      <Outlet />
      {!isUploadPage && <Footer />}
    </>
  );
};
export default ShortsLayout;
