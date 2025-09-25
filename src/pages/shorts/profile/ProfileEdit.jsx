import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // 전달받은 profileData 파싱
  const { profileData } = location.state || {};

  // 상태 관리
  const [nickname, setNickname] = useState(
    profileData?.customerNickname || "상냥한 팝귀"
  );
  const [introduce, setIntroduce] = useState(
    profileData?.introduce || "안녕하세요."
  );
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    profileData?.profileImg
      ? `https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${profileData.profileImg}`
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  // profileData가 변경될 때 상태 업데이트
  useEffect(() => {
    if (profileData) {
      setNickname(profileData.customerNickname || "");
      setIntroduce(profileData.introduce || "");
      if (profileData.profileImg) {
        setProfileImagePreview(
          `https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${profileData.profileImg}`
        );
      }
    }
  }, [profileData]);

  // 카메라 버튼 클릭 시 파일 선택
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 처리
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 이미지 파일만 허용
      if (file.type.startsWith("image/")) {
        setProfileImage(file);

        // 미리보기 이미지 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("이미지 파일만 선택 가능합니다.");
      }
    }
  };

  // 이름 입력 처리
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setNickname(value);
    }
  };

  // 자기소개 입력 처리
  const handleIntroduceChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setIntroduce(value);
    }
  };

  // 프로필 수정 API 호출
  const saveProfile = async () => {
    if (!nickname.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // 임시 customerId (실제로는 로그인된 사용자의 ID를 사용해야 함)
      formData.append("customerId", "1");
      formData.append("nickname", nickname);
      formData.append("introduce", introduce);

      if (profileImage) {
        formData.append("profileImg", profileImage);
      }

      const response = await axiosInstance.post(
        "/api/shorts/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("프로필이 성공적으로 수정되었습니다.");
        navigate("/shorts/profile?targetId=" + profileData.customerId);
      }
    } catch (error) {
      console.error("프로필 수정 중 오류 발생:", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="profile-update-main">
        <div className="profile-update-container">
          {/* 프로필 사진 섹션 */}
          <div className="profile-photo-section">
            <div className="profile-photo-container">
              <div className="profile-photo" id="profilePhoto">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="프로필 사진"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <i className="fas fa-user" id="defaultIcon" />
                )}
              </div>
              <button
                className="camera-btn"
                onClick={handleCameraClick}
                type="button"
              >
                <i className="fas fa-camera" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
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
                placeholder="이름을 입력하세요"
                value={nickname}
                onChange={handleNicknameChange}
                maxLength={20}
              />
              <div className="char-count" id="nameCharCount">
                {nickname.length}/20
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
                placeholder="자기소개를 입력하세요"
                value={introduce}
                onChange={handleIntroduceChange}
                maxLength={100}
                rows={4}
              />
              <div className="char-count" id="bioCharCount">
                {introduce.length}/100
              </div>
            </div>
          </div>

          {/* 확인 버튼 */}
          <div className="confirm-section">
            <button
              className="confirm-btn"
              id="confirmBtn"
              onClick={saveProfile}
              disabled={isLoading}
            >
              {isLoading ? "저장 중..." : "확인"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileEdit;
