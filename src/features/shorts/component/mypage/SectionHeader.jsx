// 섹션 헤더 컴포넌트 (제목 + 모두 보기 버튼)
const SectionHeader = ({
  title,
  onViewAll,
  showViewAll = true,
  viewAllText = "모두 보기",
}) => {
  return (
    <div className="section-header">
      <h3 className="section-title">{title}</h3>
      {showViewAll && onViewAll && (
        <button className="view-all-btn" onClick={onViewAll}>
          {viewAllText}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
