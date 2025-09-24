import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ChatLayout from "../layout/ChatLayout.jsx";
import Home from "../../pages/home/Home";
import Chat from "../../pages/recommend/chat/Chat";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../../pages/recommend/dash/Dashboard";
import QrPinPage from "../../pages/qrpin/QrPin";
import Payment from "../../pages/pay/Payment";
import PaymentDetails from "../../pages/pay/PaymentDetails";
import Mypage from "../../pages/common/Mypage";
import Register from "../../pages/common/Register";
import PointHistory from "../../pages/pay/PointHistory";
import Login from "../../pages/common/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "qrpin",
        element: <QrPinPage />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "payment/details",
        element: <PaymentDetails />,
      },
      {
        path: "mypage",
        element: <Mypage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "point/history",
        element: <PointHistory />,
      },
      {
        path: "login",
        element: <Login />,
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
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
