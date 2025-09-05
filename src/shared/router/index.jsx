import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../../pages/home/Home";

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
