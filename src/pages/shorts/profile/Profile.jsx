const Profile = () => {
  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="profile-main">
        <div className="profile-container">
          {/* 프로필 섹션 */}
          <div className="profile-section-container">
            <div className="profile-section">
              <div className="profile-image">
                <i className="fas fa-user" />
              </div>
              <div className="profile-info">
                <h1 className="channel-name">똑똑한 사자</h1>
                <p className="channel-greeting">안녕하세요.</p>
                <div className="channel-stats">
                  <span className="subscriber-count">구독자 99명</span>
                  <span className="video-count">동영상 99개</span>
                </div>
              </div>
            </div>

            <button className="subscribe-btn">구독</button>
          </div>
          {/* 정렬 옵션 */}
          <div className="sort-options">
            <button className="sort-btn active" data-sort="latest">
              최신순
            </button>
            <button className="sort-btn" data-sort="popular">
              인기순
            </button>
            <button className="sort-btn" data-sort="date">
              날짜순
            </button>
          </div>

          {/* 영상 그리드 */}
          <div className="video-grid">
            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <i className="fas fa-play" />
                <div className="video-overlay">
                  <div className="like-count">
                    <i className="fas fa-thumbs-up" />
                    <span>999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Profile;
