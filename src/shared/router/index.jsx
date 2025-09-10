import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../../pages/home/Home";
import QrPinPage from "../../pages/qrpin/QrPin";

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
]);

export default router;
