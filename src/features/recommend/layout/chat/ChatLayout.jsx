import { Outlet } from "react-router-dom";
import Header from "../../../../shared/components/Header.jsx";
import "./ChatLayout.css";

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