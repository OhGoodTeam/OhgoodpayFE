import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../../pages/home/Home";
import Payment from "../../pages/pay/Payment";

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
    path: "/payment",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Payment />,
      },
    ],
  },
  {},
]);

export default router;
