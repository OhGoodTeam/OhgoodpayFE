import "../../css/mypage/Mygrade.css";
import React from "react";
import bronze from "../../../../shared/assets/img/bronze.png";
import silver from "../../../../shared/assets/img/silver.png";
import gold from "../../../../shared/assets/img/gold.png";
import platinum from "../../../../shared/assets/img/platinum.png";
import diamond from "../../../../shared/assets/img/Diamond.png";
import { useState } from "react";
import { useEffect } from "react";

const Mygrade = ({ gradeName, pointPercent, gradePoint }) => {
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const [nextGrade, setNextGrade] = useState("");
  const [nextPointPercent, setNextPointPercent] = useState(0);
  useEffect(() => {
    if (gradeName === "bronze") {
      setStartPoint(0);
      setEndPoint(20);
      setNextGrade("Silver");
      setNextPointPercent(0.6);
    } else if (gradeName === "silver") {
      setStartPoint(21);
      setEndPoint(40);
      setNextGrade("Gold");
      setNextPointPercent(1.0);
    } else if (gradeName === "gold") {
      setStartPoint(41);
      setEndPoint(60);
      setNextGrade("Platinum");
      setNextPointPercent(1.5);
    } else if (gradeName === "platinum") {
      setStartPoint(61);
      setEndPoint(90);
      setNextGrade("Diamond");
      setNextPointPercent(2.0);
    } else if (gradeName === "diamond") {
      setStartPoint(91);
      setEndPoint(150);
      setNextGrade("none");
    }
  }, [gradePoint]);
  return (
    <>
      <div className="mygrade-page">
        <div className="mygrade-title">
          <div className="mygrade-title-top">
            <span>현재 등급</span>
            <span>현재 적립률</span>
          </div>
          <div className="mygrade-title-bottom">
            <div className="mygrade-title-bottom-left">
              {gradeName === "bronze" ? <img src={bronze}></img> : ""}
              {gradeName === "silver" ? <img src={silver}></img> : ""}
              {gradeName === "gold" ? <img src={gold}></img> : ""}
              {gradeName === "platinum" ? <img src={platinum}></img> : ""}
              {gradeName === "diamond" ? <img src={diamond}></img> : ""}
              <span>
                {gradeName === "bronze" ? "Bronze" : ""}
                {gradeName === "silver" ? "Silver" : ""}
                {gradeName === "gold" ? "Gold" : ""}
                {gradeName === "platinum" ? "Platinum" : ""}
                {gradeName === "diamond" ? "Diamond" : ""}
              </span>
            </div>
            <div className="mygrade-title-bottom-right">
              <span>{pointPercent} %</span>
            </div>
          </div>
        </div>
        <div className="mygrade-content">
          <div className="mygrade-content-top">
            <span>다음 등급까지 {endPoint - gradePoint}점</span>
          </div>
          <div className="mygrade-content-middle">
            <div
              className="mygrade-content-middle-bar"
              style={{
                width: `${
                  ((gradePoint - startPoint) / (endPoint - startPoint)) * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="mygrade-content-bottom">
            <span>현재 {gradePoint}점</span>
            <span>{endPoint}점</span>
          </div>
        </div>
        <div className="mygrade-next">
          {nextGrade === "none" ? (
            <span>최고 등급입니다!</span>
          ) : (
            <>
              <span>다음 등급 {nextGrade} 승급 시</span>
              <span>적립률 {nextPointPercent} %</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Mygrade);
