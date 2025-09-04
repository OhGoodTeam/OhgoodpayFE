import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ConfirmedModal from "../components/ConfirmedModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ConfirmedModal />,
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
]);

export default router;
