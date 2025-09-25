import "../../css/point/PointHistoryList.css";
import { useState } from "react";
import { useEffect } from "react";
import { PiDotOutlineFill } from "react-icons/pi";
import React from "react";
import emptyimg from "../../../../shared/assets/img/emptyinfo.png";

const PointHistoryList = ({ pointHistory }) => {
  const [groupedPointHistory, setGroupedPointHistory] = useState([]);

  useEffect(() => {
    // payment의 날짜별로 년-월-일(YYYY-MM-DD)로 그룹화합니다.
    // groupedPayments는 [{ date: 'YYYY-MM-DD', payments: [...] }, ...] 형태의 배열이 됩니다.
    const grouped = pointHistory.reduce((acc, pointHistory) => {
      const date = new Date(pointHistory.date);
      // 년-월-일 형식으로 날짜를 만듭니다.
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      // 해당 날짜에 해당하는 그룹이 없으면 새로 만듭니다.
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(pointHistory);
      return acc;
    }, {});

    // 객체를 배열로 변환하여 setGroupedPayments에 저장합니다.
    setGroupedPointHistory(
      Object.entries(grouped).map(([date, pointHistory]) => ({
        date,
        pointHistory,
      }))
    );
  }, [pointHistory]);

  return (
    <>
      <div className="point-history-list">
        {groupedPointHistory.length === 0 ? (
          <div className="point-history-list-group-point-history-empty">
            <img src={emptyimg} />
            <span>포인트 내역이 없습니다.</span>
          </div>
        ) : (
          groupedPointHistory.map((group, index) => (
            <div key={index} className="point-history-list-group">
              <div className="point-history-list-group-date">{group.date}</div>
              <div className="point-history-list-group-point-history">
                {group.pointHistory.map((point, index) => (
                  <div
                    key={index}
                    className="point-history-list-group-point-history-item"
                  >
                    <div className="point-history-list-group-point-history-item-left">
                      <div className="point-history-list-group-point-history-item-left-dot">
                        <PiDotOutlineFill />
                      </div>
                      <div className="point-history-list-group-point-history-item-left-text">
                        <div className="point-history-list-group-point-history-item-left-text-name">
                          {point.pointExplain}
                        </div>
                        <div className="point-history-list-group-point-history-item-left-text-time">
                          {point.date.substring(11, 16)}
                        </div>
                      </div>
                    </div>
                    <div className="point-history-list-group-point-history-item-price">
                      {point.point > 0 ? "+" + point.point : point.point} P
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PointHistoryList;
