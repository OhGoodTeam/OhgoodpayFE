import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import "../assets/css/ChatLayout.css";

const ChatLayout = () => {
  return (
    <div className="chat-layout">
      <Header />
      <main className="chat-main">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLayout;