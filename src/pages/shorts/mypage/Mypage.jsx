const Mypage = () => {
  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="mypage-main">
        <div className="mypage-container">
          {/* 프로필 섹션 */}
          <div className="profile-section">
            <div className="profile-image">
              <i className="fas fa-user" />
            </div>
            <div className="profile-info">
              <h2 className="username">상냥한 펭귄</h2>
              <a href="#" className="channel-link">
                채널 보기 &gt;
              </a>
            </div>
          </div>

          {/* 구독 섹션 */}
          <div className="subscription-section">
            <h3 className="section-title">구독</h3>
            <div className="subscription-list">
              <div className="subscription-item">
                <div className="sub-profile">
                  <i className="fas fa-user" />
                </div>
                <span className="sub-name">user_1</span>
              </div>
              <div className="subscription-item">
                <div className="sub-profile">
                  <i className="fas fa-user" />
                </div>
                <span className="sub-name">user_1</span>
              </div>
              <div className="subscription-item">
                <div className="sub-profile">
                  <i className="fas fa-user" />
                </div>
                <span className="sub-name">user_1</span>
              </div>
              <div className="subscription-item">
                <div className="sub-profile">
                  <i className="fas fa-user" />
                </div>
                <span className="sub-name">user_1</span>
              </div>
              <div className="subscription-item">
                <div className="sub-profile">
                  <i className="fas fa-user" />
                </div>
                <span className="sub-name">user_1</span>
              </div>
              <div className="subscription-item">
                <div className="sub-profile">
                  <i className="fas fa-user" />
                </div>
                <span className="sub-name">user_1</span>
              </div>
              <div className="subscription-item">
                <div className="sub-profile">
                  <i className="fas fa-user" />
                </div>
                <span className="sub-name">user_1</span>
              </div>
              <div className="subscription-item view-all">
                <span className="view-all-text">전체</span>
              </div>
            </div>
          </div>

          {/* 좋아요 표시한 영상 섹션 */}
          <div className="liked-videos-section">
            <div className="section-header">
              <h3 className="section-title">좋아요 표시한 영상</h3>
              <button className="view-all-btn">모두 보기</button>
            </div>
            <div className="video-list">
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 단 영상 섹션 */}
          <div className="commented-videos-section">
            <div className="section-header">
              <h3 className="section-title">댓글 단 영상</h3>
              <button className="view-all-btn">모두 보기</button>
            </div>
            <div className="video-list">
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
              <div className="video-item">
                <div className="video-thumbnail">
                  <i className="fas fa-play" />
                </div>
                <div className="video-info">
                  <h4 className="video-title">제목</h4>
                  <p className="video-description">내용 내용 ...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Mypage;
