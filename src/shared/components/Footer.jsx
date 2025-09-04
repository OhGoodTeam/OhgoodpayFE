import "../assets/css/Footer.css";
import { RxVideo } from "react-icons/rx";
import { IoHomeSharp } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <div className={`footer`}>
        <div className={`footer-ico`}>
          <RxVideo alt="footer-ico" />
          <span>Shorts</span>
        </div>
        <div className={`footer-ico`}>
          <IoHomeSharp alt="footer-ico" />
          <span>Home</span>
        </div>
        <div className={`footer-ico`}>
          <BsPersonCircle alt="footer-ico" />
          <span>Mypage</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
