import "./ProfileAvatar.css";

// 채팅에서 사용하는 아바타 컴포넌트
const ProfileAvatar = ({ size = 50, src, alt = "프로필" }) => {
  return (
    <div
      className="profile-avatar"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="avatar-placeholder">
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;