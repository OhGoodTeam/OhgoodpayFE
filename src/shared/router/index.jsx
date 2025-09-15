import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../../pages/home/Home";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../../pages/recommend/dash/Dashboard";

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
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
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
  // {},
]);

export default router;
