// 초기 로딩 스피너
const LoadingSpinner = ({ isVisible, message = "검색 중..." }) => {
  if (!isVisible) return null;

  return (
    <div className="initial-loading">
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
