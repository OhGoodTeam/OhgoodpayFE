// 가로 스크롤 리스트 컴포넌트 (드래그 스크롤 기능 포함)
const HorizontalScrollList = ({
  items = [],
  renderItem,
  onViewAll,
  viewAllText = "전체",
  showViewAll = true,
  containerStyle = {},
  listStyle = {},
}) => {
  // 드래그 스크롤 기능
  const handleMouseDown = (e) => {
    const container = e.currentTarget;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    container.style.cursor = "grabbing";

    const handleMouseMove = (e) => {
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      container.style.cursor = "grab";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <style>
        {`
          .horizontal-scroll-list::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div style={containerStyle}>
        <div
          className="horizontal-scroll-list"
          style={{
            overflowX: "auto",
            display: "flex",
            gap: "10px",
            paddingBottom: "10px",
            paddingRight: "10px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            whiteSpace: "nowrap",
            cursor: "grab",
            userSelect: "none",
            minHeight: "80px",
            ...listStyle,
          }}
          onWheel={(e) => {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
          }}
          onMouseDown={handleMouseDown}
        >
          {/* 아이템들 렌더링 */}
          {items.map((item, index) =>
            renderItem(item, index, item.userId || item.videoId || index)
          )}

          {/* 전체 보기 버튼 */}
          {showViewAll && onViewAll && (
            <div
              className="subscription-item view-all"
              onClick={onViewAll}
              style={{ flexShrink: 0 }}
            >
              <span className="view-all-text">{viewAllText}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HorizontalScrollList;
