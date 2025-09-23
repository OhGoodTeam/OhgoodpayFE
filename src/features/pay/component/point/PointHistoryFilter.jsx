import "../../css/point/PointHistoryFilter.css";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";

const PointHistoryFilter = ({ year, month, handleYear, handleMonth }) => {
  const handleArrowLeft = () => {
    const newMonth = month - 1;
    if (newMonth === 0) {
      handleYear(year - 1);
      handleMonth(12);
    } else {
      handleMonth(newMonth);
    }
  };
  const handleArrowRight = () => {
    const newMonth = month + 1;
    if (newMonth === 13) {
      handleYear(year + 1);
      handleMonth(1);
    } else {
      handleMonth(newMonth);
    }
  };
  return (
    <div className="point-history-filter">
      <div className="point-history-filter-year">
        <IoMdArrowDropleft onClick={handleArrowLeft} />
        <span>{year} 년</span>
        <span>{month} 월</span>
        <IoMdArrowDropright onClick={handleArrowRight} />
      </div>
    </div>
  );
};

export default PointHistoryFilter;
