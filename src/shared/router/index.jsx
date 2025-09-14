import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ChatLayout from "../layout/ChatLayout.jsx";
import Home from "../../pages/home/Home";
import Chat from "../../pages/recommend/chat/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        //element: <ConfirmedModal />,
        element: <Home />,
      },
    ],
  },
  {
    path: "/chat",
    element: <ChatLayout />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
    ],
  },
  {
    path: "/shorts",
    element: <MainLayout />,
    children: [
      {
        index: true,
      },
    ],
  },
]);

export default router;
