import "../../css/paymentdatails/SearchPayment.css";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { TfiSearch } from "react-icons/tfi";
import { usePaymentFilterStore } from "../../../../shared/store/PaymentFilterStore";
import React from "react";

const SearchPayment = () => {
  const { year, month, search, setYear, setMonth, setSearch } =
    usePaymentFilterStore();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleArrowLeft = () => {
    const newMonth = month - 1;
    if (newMonth === 0) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(newMonth);
    }
  };

  const handleArrowRight = () => {
    const newMonth = month + 1;
    if (newMonth === 13) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(newMonth);
    }
  };
  return (
    <>
      <div className="search-payment">
        <div className="search-payment-date-filter">
          <IoMdArrowDropleft onClick={handleArrowLeft} />
          <span>{year} 년</span>
          <span>{month} 월</span>
          <IoMdArrowDropright onClick={handleArrowRight} />
        </div>
        <div className="search-payment-name-filter">
          <TfiSearch />
          <input
            type="text"
            placeholder="결제명 검색"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(SearchPayment);
