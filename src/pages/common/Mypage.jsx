import "./Mypage.css";
import React from "react";
import Myaccount from "../../features/common/component/Myaccount";
import Mygrade from "../../features/common/component/Mygrade";
import Mypoint from "../../features/common/component/Mypoint";
import Questions from "../../features/common/component/Questions";
import axiosInstance from "../../shared/api/axiosInstance";
import { useState } from "react";
import { useEffect } from "react";

const Mypage = () => {
  const [userInfo, setUserInfo] = useState([]);
  const getApi = async () => {
    const response = await axiosInstance.get(`/api/mypage/1`);
    if (response.status === 200) {
      setUserInfo(response.data);
      console.log(userInfo);
    } else {
      console.log("error");
      s;
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  return (
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
  );
};

export default React.memo(Mypage);
