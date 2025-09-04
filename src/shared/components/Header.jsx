import "../assets/css/Header.css";
import logo from "../assets/img/logo_big.png";

const Header = () => {
  const handleTest = () => {
    console.log("test");
  };
  return (
    <>
      <div className="header">
        <img src={logo} alt="logo" onClick={handleTest} />
      </div>
    </>
  );
};

export default Header;
