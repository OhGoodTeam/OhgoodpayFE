import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../../pages/home/Home";
import QrPinPage from "../../pages/qrpin/QrPin";
import Payment from "../../pages/pay/Payment";
import PaymentDetails from "../../pages/pay/PaymentDetails";
import Mypage from "../../pages/common/Mypage";
import Register from "../../pages/common/Register";
import PointHistory from "../../pages/pay/PointHistory";

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
    ],
  },
]);

export default router;
