import "./PointHistory.css";
import PointHistoryFilter from "../../features/pay/component/point/PointHistoryFilter";
import PointHistoryList from "../../features/pay/component/point/PointHistoryList";
import axiosInstance from "../../shared/api/axiosInstance";
import { useState } from "react";
import { useEffect } from "react";

const PointHistory = () => {
  const [pointHistory, setPointHistory] = useState([]);
  const [filteredPointHistory, setFilteredPointHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handleYear = (e) => {
    setYear(e);
  };

  const handleMonth = (e) => {
    setMonth(e);
  };

  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    const newPointHistory = pointHistory.filter((point) => {
      return (
        new Date(point.date).getFullYear() === year &&
        new Date(point.date).getMonth() + 1 === month
      );
    });
    setFilteredPointHistory(newPointHistory);
  }, [year, month]);

  const getApi = async () => {
    const response = await axiosInstance.get(`/api/point/history`);
    if (response.status === 200) {
      setIsLoading(false);
      setPointHistory(response.data);
      const newPointHistory = response.data.filter((point) => {
        return (
          new Date(point.date).getFullYear() === year &&
          new Date(point.date).getMonth() + 1 === month
        );
      });
      setFilteredPointHistory(newPointHistory);
    } else {
      console.log("error");
    }
  };

  return (
    <>
      <div className="point-history-page">
        {isLoading ? (
          <div className="point-history-loading">
            <span>Loading...</span>
          </div>
        ) : (
          <>
            <div className="point-history-title">
              <span>포인트 내역</span>
            </div>
            <PointHistoryFilter
              year={year}
              month={month}
              handleYear={handleYear}
              handleMonth={handleMonth}
            />
            <PointHistoryList pointHistory={filteredPointHistory} />
          </>
        )}
      </div>
    </>
  );
};

export default PointHistory;
