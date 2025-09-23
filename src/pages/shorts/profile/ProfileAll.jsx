import { HiDotsHorizontal } from "react-icons/hi";

const ProfileAll = () => {
  return (
    <main className="liked-videos-main">
      <div className="liked-videos-container">
        {/* 페이지 제목 */}
        <select>
          <option value="all">최신순</option>
          <option value="liked">인기순</option>
          <option value="commented">날짜순</option>
        </select>

        {/* 영상 목록 */}
        <div className="liked-videos-list">
          <div className="shorts-video-item with-actions">
            <div className="video-thumbnail">
              <i className="fas fa-play" />
            </div>
            <div className="video-info">
              <h3 className="video-title">제목</h3>
              <p className="video-description">내용 내용 내용</p>
              <div className="video-stats">
                <div className="stat-item">
                  <i className="fas fa-thumbs-up" />
                  <span>999</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-comment" />
                  <span>99</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="더보기"
              className="more-btn"
              onClick={() => {}}
            >
              <HiDotsHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ProfileAll;
