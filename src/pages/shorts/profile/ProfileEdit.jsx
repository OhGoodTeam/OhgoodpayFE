const ProfileEdit = () => {
  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="profile-update-main">
        <div className="profile-update-container">
          {/* 프로필 사진 섹션 */}
          <div className="profile-photo-section">
            <div className="profile-photo-container">
              <div className="profile-photo" id="profilePhoto">
                <i className="fas fa-user" id="defaultIcon" />
                <img
                  id="profileImage"
                  style={{ display: "none" }}
                  alt="\uD504\uB85C\uD544 \uC0AC\uC9C4"
                />
              </div>
              <button
                className="camera-btn"
                // onClick={selectProfilePhoto}
              >
                <i className="fas fa-camera" />
              </button>
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                style={{ display: "none" }}
                // onChange={(event) => {
                //   handlePhotoChange(event);
                // }}
              />
            </div>
          </div>

          {/* 폼 섹션 */}
          <div className="form-section">
            {/* 이름 입력 */}
            <div className="form-group">
              <label htmlFor="nameInput" className="form-label">
                이름
              </label>
              <input
                type="text"
                id="nameInput"
                className="form-input"
                placeholder="\uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694"
                value="\uC0C1\uB0E5\uD55C \uD3AD\uADC4"
                maxLength={20}
              />
              <div className="char-count" id="nameCharCount">
                10/20
              </div>
            </div>

            {/* 자기소개 입력 */}
            <div className="form-group">
              <label htmlFor="bioInput" className="form-label">
                자기소개
              </label>
              <textarea
                id="bioInput"
                className="form-textarea"
                placeholder="\uC790\uAE30\uC18C\uAC1C\uB97C \uC785\uB825\uD558\uC138\uC694"
                maxLength={100}
                rows={4}
              >
                안녕하세요.
              </textarea>
              <div className="char-count" id="bioCharCount">
                6/100
              </div>
            </div>
          </div>

          {/* 확인 버튼 */}
          <div className="confirm-section">
            <button
              className="confirm-btn"
              id="confirmBtn"
              // onClick={saveProfile}
            >
              확인
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
export default ProfileEdit;
