import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import PaymentWidgetLayout from "../layout/PaymentWidgetLayout";
import PaymentWidget from "../../features/pay/component/PaymentWidget";
import Home from "../../pages/home/Home";
import QrPinPage from "../../pages/qrpin/QrPin";

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
      {
        path: "qrpin",        
        element: <QrPinPage />,
      },
    ],
  },

  {
    path:"/paymentwidget",
    element:<PaymentWidgetLayout/>,
  },
  // {
  //   path: "/shorts",
  //   element: <MainLayout />,
  //   children: [
  //     {
  //       index: true,
  //     },
  //   ],
  // },
  {},
]);

export default router;
