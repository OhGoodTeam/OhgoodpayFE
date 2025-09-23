// 프로필 섹션 컴포넌트
const ProfileSection = ({
  profileImage = "/src/features/shorts/img/profile.jpeg",
  username = "사용자",
  channelUrl,
  channelLinkText = "채널 보기 >",
}) => {
  return (
    <div className="profile-section">
      <div className="profile-image">
        {profileImage && !profileImage.includes('/src/features/shorts/img/profile.jpeg') ? (
          <img
            src={profileImage}
            alt="프로필"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <i className="fas fa-user" style={{ color: "#fff", fontSize: "32px" }} />
        )}
      </div>
      <div className="profile-info">
        <h2 className="username">{username}</h2>
        {channelUrl && (
          <a href={channelUrl} className="channel-link">
            {channelLinkText}
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
