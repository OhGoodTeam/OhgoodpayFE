import "../assets/css/Footer.css";
import { RxVideo } from "react-icons/rx";
import { IoHomeSharp } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";

const Footer = ({ type, selected }) => {
  const footerType = type === "shorts" ? "footer-shorts" : "footer-main";
  return (
    <>
      <div className={`footer ${footerType}`}>
        <div className={`footer-ico`}>
          <RxVideo
            alt="footer-ico"
            className={selected === "shorts" ? "selected" : ""}
          />
          <span>Shorts</span>
        </div>
        <div className={`footer-ico`}>
          <IoHomeSharp
            alt="footer-ico"
            className={selected === "home" ? "selected" : ""}
          />
          <span>Home</span>
        </div>
        <div className={`footer-ico`}>
          <BsPersonCircle
            alt="footer-ico"
            className={selected === "mypage" ? "selected" : ""}
          />
          <span>Mypage</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
