import "../../css/mypage/Myaccount.css";
import React from "react";
import kookmin from "../../../../shared/assets/img/kookmin.png";
import ibk from "../../../../shared/assets/img/ibk.png";
import kakao from "../../../../shared/assets/img/kakao.png";
import hana from "../../../../shared/assets/img/hana.png";
import woori from "../../../../shared/assets/img/woori.png";
import shinhan from "../../../../shared/assets/img/shinhan.png";
import toss from "../../../../shared/assets/img/toss.png";

const Myaccount = ({ account, accountName }) => {
  return (
    <>
      <div className="myaccount-page">
        <div className="myaccount-title">
          <span>연결된 계좌</span>
        </div>
        <div className="myaccount-content">
          <div className="myaccount-content-img">
            {accountName === "국민" ? <img src={kookmin} /> : null}
            {accountName === "기업" ? <img src={ibk} /> : null}
            {accountName === "카카오" ? <img src={kakao} /> : null}
            {accountName === "하나" ? <img src={hana} /> : null}
            {accountName === "우리" ? <img src={woori} /> : null}
            {accountName === "신한" ? <img src={shinhan} /> : null}
            {accountName === "토스" ? <img src={toss} /> : null}
          </div>
          <div className="myaccount-content-info">
            <span>{account}</span>
            <span>{accountName}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Myaccount);
