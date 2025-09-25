import "./Mypage.css";
import React from "react";
import Myaccount from "../../features/common/component/mypage/Myaccount";
import Mygrade from "../../features/common/component/mypage/Mygrade";
import Mypoint from "../../features/common/component/mypage/Mypoint";
import Questions from "../../features/common/component/mypage/Questions";
import axiosInstance from "../../shared/api/axiosInstance";
import { useState } from "react";
import { useEffect } from "react";

const Mypage = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getApi = async () => {
    const response = await axiosInstance.get(`/api/mypage`);
    if (response.status === 200) {
      setIsLoading(false);
      setUserInfo(response.data);
      console.log(userInfo);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="mypage-loading">
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <div className="mypage-page">
            <div className="mypage-title">
              <span>{userInfo.name}님 안녕하세요!</span>
              <span>{userInfo.emailId}</span>
            </div>
            <Mygrade
              gradeName={userInfo.gradeName}
              pointPercent={userInfo.pointPercent}
              gradePoint={userInfo.gradePoint}
            />
            <Myaccount
              account={userInfo.account}
              accountName={userInfo.accountName}
            />
            <Mypoint point={userInfo.point} />
            <Questions />
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(Mypage);
