import "../assets/css/Footer.css";
import { RxVideo } from "react-icons/rx";
import { IoHomeSharp } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const [footerStyle, setFooterStyle] = useState(false);
  useEffect(() => {
    if (location.pathname.includes("shorts")) {
      setFooterStyle(true);
    }
  }, [location]);
  
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const handleMypage = () => {
    navigate("/mypage");
  };

  return (
    <>
      <div
        className={`footer`}
        style={{
          backgroundColor: footerStyle ? "#000" : "#fff",
          color: footerStyle ? "#787878" : "#000000",
        }}
      >
        <Link to="/shorts/feeds">
          <div className={`footer-ico`}>
            <RxVideo alt="footer-ico" />
            <span>Shorts</span>
          </div>
        </Link>
        <div className={`footer-ico`}>
          <IoHomeSharp
            alt="footer-ico"
            onClick={handleHome}
            className={window.location.pathname === "/" && "selected"}
          />
          <span>Home</span>
        </div>
        <div className={`footer-ico`}>
          <BsPersonCircle
            alt="footer-ico"
            onClick={handleMypage}
            className={window.location.pathname === "/mypage" && "selected"}
          />
          <span>Mypage</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
