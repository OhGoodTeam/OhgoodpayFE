import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ShortsHeader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shorts/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      navigate(`/shorts/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
      <button className="profile-btn">
        <i className="fas fa-user"></i>
      </button>
    </header>
  );
};
export default ShortsHeader;
