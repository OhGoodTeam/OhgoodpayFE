// 로딩/에러 상태 처리 래퍼 컴포넌트
const LoadingErrorWrapper = ({
  loading,
  error,
  loadingMessage = "로딩 중...",
  errorMessage = "오류가 발생했습니다",
  mainClassName = "mypage-main",
  containerClassName = "mypage-container",
  children,
}) => {
  if (loading) {
    return (
      <main className={mainClassName}>
        <div className={containerClassName}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            {loadingMessage}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={mainClassName}>
        <div className={containerClassName}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            {errorMessage}: {error.message}
          </div>
        </div>
      </main>
    );
  }

  return children;
};

export default LoadingErrorWrapper;
