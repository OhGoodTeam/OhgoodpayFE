import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRequireLogin } from "../../features/shorts/hooks/feed/useRequireLogin";

const ShortsHeader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const { requireLogin } = useRequireLogin();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shorts/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // 검색어가 비어있으면 q 파라미터 없이 전체 영상 조회
      navigate(`/shorts/search`);
    }
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      navigate(`/shorts/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // 검색어가 비어있으면 q 파라미터 없이 전체 영상 조회
      navigate(`/shorts/search`);
    }
  };

  // 프로필 페이지 이동
  const handleProfileClick = async () => {
    const ok = await requireLogin();
    if (!ok) return;
    navigate("/shorts/mypage");
  };

  return (
    <header className="header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i>
      </button>
      <form className="search-bar" onSubmit={handleSearch}>
        <i className="fas fa-search" onClick={handleSearchIconClick}></i>
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <button className="profile-btn" onClick={handleProfileClick}>
        <i className="fas fa-user"></i>
      </button>
    </header>
  );
};
export default ShortsHeader;
