import "../../css/mypage/Questions.css";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useState } from "react";

const Questions = () => {
  const [q1IsOpen, setQ1IsOpen] = useState(false);
  const [q2IsOpen, setQ2IsOpen] = useState(false);
  const [q3IsOpen, setQ3IsOpen] = useState(false);
  const [q4IsOpen, setQ4IsOpen] = useState(false);
  const [q5IsOpen, setQ5IsOpen] = useState(false);
  const [q6IsOpen, setQ6IsOpen] = useState(false);
  const [q7IsOpen, setQ7IsOpen] = useState(false);

  const handleQ1IsOpen = () => {
    setQ1IsOpen(!q1IsOpen);
  };
  const handleQ2IsOpen = () => {
    setQ2IsOpen(!q2IsOpen);
  };
  const handleQ3IsOpen = () => {
    setQ3IsOpen(!q3IsOpen);
  };
  const handleQ4IsOpen = () => {
    setQ4IsOpen(!q4IsOpen);
  };
  const handleQ5IsOpen = () => {
    setQ5IsOpen(!q5IsOpen);
  };
  const handleQ6IsOpen = () => {
    setQ6IsOpen(!q6IsOpen);
  };
  const handleQ7IsOpen = () => {
    setQ7IsOpen(!q7IsOpen);
  };

  return (
    <>
      <div className="questions-page">
        <div className="questions-title">
          <span>자주하는 질문</span>
        </div>
        <div className="questions-content">
          <div id="1" className="questions-content-item">
            <div
              className="questions-content-item-title"
              onClick={handleQ1IsOpen}
            >
              <span>1. BNPL이 무엇인가요?</span>
              {q1IsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {q1IsOpen ? (
              <div className="questions-content-item-content">
                <span>
                  BNPL이란 후불 결제 서비스입니다. 부담없이 편하게 결제하시고
                  다음달 납부일에 결제하시면 됩니다.
                </span>
              </div>
            ) : null}
          </div>
          <div id="2" className="questions-content-item">
            <div
              className="questions-content-item-title"
              onClick={handleQ2IsOpen}
            >
              <span>2. 즉시 납부는 무엇인가요?</span>
              {q2IsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {q2IsOpen ? (
              <div className="questions-content-item-content">
                <span>
                  다음 달 결제일 전에 먼저 납부하실 수 있습니다. 먼저
                  납부하신만큼 현재 한도가 풀립니다
                </span>
              </div>
            ) : null}
          </div>
          <div id="3" className="questions-content-item">
            <div
              className="questions-content-item-title"
              onClick={handleQ3IsOpen}
            >
              <span>3. 포인트는 어떻게 모으고 쓰나요?</span>
              {q3IsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {q3IsOpen ? (
              <div className="questions-content-item-content">
                <span>
                  포인트 결제시 적립률과 출석 체크를 통해 얻으실 수 있습니다.
                  모으신 포인트는 결제하실 때 사용하시면 됩니다.
                </span>
              </div>
            ) : null}
          </div>
          <div id="4" className="questions-content-item">
            <div
              className="questions-content-item-title"
              onClick={handleQ4IsOpen}
            >
              <span>4. 등급은 어떻게 올리나요?</span>
              {q4IsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {q4IsOpen ? (
              <div className="questions-content-item-content">
                <span>
                  등급은 구매 금액에 따라 자동으로 등급 점수가 반영됩니다. 목표
                  점수를 채우게 되면 다음 .달 자동으로 등급이 올라갑니다
                </span>
              </div>
            ) : null}
          </div>
          <div id="5" className="questions-content-item">
            <div
              className="questions-content-item-title"
              onClick={handleQ5IsOpen}
            >
              <span>5. 오굿스코어는 무엇인가요?</span>
              {q5IsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {q5IsOpen ? (
              <div className="questions-content-item-content">
                <span>
                  고객님의 납부 이력, 등급 점수, 제재 횟수, 결제 횟수, 가입일
                  등을 종합적으로 고려한 오굿페이만의 신용점수 입니다. 납부를
                  성실하게 하시고 구매 횟수가 많아지시면 점수가 올라갑니다.
                </span>
              </div>
            ) : null}
          </div>
          <div id="6" className="questions-content-item">
            <div
              className="questions-content-item-title"
              onClick={handleQ6IsOpen}
            >
              <span>6. 납부 연장은 무엇인가요?</span>
              {q6IsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {q6IsOpen ? (
              <div className="questions-content-item-content">
                <span>
                  만약 고객님께서 15일에 납부가 불가능하시면 연장 신청을 통해 그
                  달 말일로 연장하실 수 있습니다. 연장은 월 1회만 가능합니다.
                </span>
              </div>
            ) : null}
          </div>
          <div id="7" className="questions-content-item">
            <div
              className="questions-content-item-title"
              onClick={handleQ7IsOpen}
            >
              <span>7. 연체 시 어떻게 해야하나요?</span>
              {q7IsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {q7IsOpen ? (
              <div className="questions-content-item-content">
                <span>
                  연체 시에는 등록된 이메일로 안내 메일이 전송됩니다. 연체 시
                  납부액과 절차 내용이 첨부되어 있습니다.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Questions);
