import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ShortsLayout from "../layout/ShortsLayout";
import Feed from "../../pages/shorts/feed/Feed";
import Home from "../../pages/home/Home";
import Upload from "../../pages/shorts/upload/Upload";
import Search from "../../pages/shorts/search/Search";
import Mypage from "../../pages/common/Mypage";
import ShortsMypage from "../../pages/shorts/mypage/Mypage";
import MypageSubscribe from "../../pages/shorts/mypage/MypageSubscribe";
import MypageAll from "../../pages/shorts/mypage/MypageAll";
import MypageComment from "../../pages/shorts/mypage/MypageComment";
import Profile from "../../pages/shorts/profile/Profile";
import ProfileEdit from "../../pages/shorts/profile/ProfileEdit";
import ProfileAll from "../../pages/shorts/profile/ProfileAll";
import ChatLayout from "../layout/ChatLayout.jsx";
import Chat from "../../pages/recommend/chat/Chat";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../../pages/recommend/dash/Dashboard";
import QrPinPage from "../../pages/qrpin/QrPin";
import Payment from "../../pages/pay/Payment";
import PaymentDetails from "../../pages/pay/PaymentDetails";
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
  {
    path: "/shorts",
    element: <ShortsLayout />,
    children: [
      // /shorts 접근 시 /shorts/feeds로 리다이렉트
      {
        index: true,
        element: <Navigate to="/shorts/feeds" replace />,
      },
      // 피드 페이지
      {
        path: "feeds",
        element: <Feed />,
      },
      // 업로드 페이지
      {
        path: "upload",
        element: <Upload />,
      },
      // 검색 페이지
      {
        path: "search",
        element: <Search />,
      },
      // 마이페이지
      {
        path: "mypage",
        element: <ShortsMypage />,
      },
      // 마이페이지 - 구독
      {
        path: "mypage/subscribe",
        element: <MypageSubscribe />,
      },
      // 마이페이지 - 모두 보기 (좋아요 표시한 영상, 댓글단 영상)
      {
        path: "mypage/all",
        element: <MypageAll />,
      },
      // 마이페이지 - 댓글 단 영상
      {
        path: "mypage/comments",
        element: <MypageComment />,
      },
      // 프로필 페이지
      {
        path: "profile",
        element: <Profile />,
      },
      // 프로필 페이지 - 편집
      {
        path: "profile/edit",
        element: <ProfileEdit />,
      },
      {
        path: "profile/all",
        element: <ProfileAll />,
      },
    ],
  },
]);

export default router;
