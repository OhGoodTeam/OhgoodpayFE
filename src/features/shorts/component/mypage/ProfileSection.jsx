import { useNavigate } from "react-router-dom";
// 프로필 섹션 컴포넌트
const ProfileSection = ({ avatarUrl, username = "사용자", userId }) => {
  const navigate = useNavigate();
  return (
    <div className="profile-section">
      {avatarUrl ? (
        <div
          className="profile-image"
          style={{
            backgroundImage: `url(${`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${avatarUrl}`})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      ) : (
        <div className="profile-image">
          <i className="fas fa-user" />
        </div>
      )}

      <div className="profile-info">
        <h2 className="username">{username}</h2>
        <a
          className="channel-link"
          onClick={() => {
            navigate(`/shorts/profile?targetId=${userId}`);
          }}
          style={{ cursor: "pointer" }}
        >
          채널 보기 &gt;
        </a>
      </div>
    </div>
  );
};

export default ProfileSection;
