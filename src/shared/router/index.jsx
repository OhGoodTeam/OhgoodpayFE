import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../../pages/home/Home";
import QrPinPage from "../../pages/qrpin/QrPin";
import Payment from "../../pages/pay/Payment";
import PaymentDetails from "../../pages/pay/PaymentDetails";
import Mypage from "../../pages/common/Mypage";

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
    ],
  },
  {
    path: "/payment",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Payment />,
      },
    ],
  },
  {
    path: "/payment/details",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <PaymentDetails />,
      },
    ],
  },
  {
    path: "/mypage",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Mypage />,
      },
    ],
  },
]);

export default router;
