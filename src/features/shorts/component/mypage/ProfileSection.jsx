// 프로필 섹션 컴포넌트
const ProfileSection = ({
  avatarUrl,
  username = "사용자",
  channelUrl,
  channelLinkText = "채널 보기 >",
}) => {
  return (
    <div className="profile-section">
      <div
        className="profile-image"
        style={{
          backgroundImage: `url(${`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${avatarUrl}`})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
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
