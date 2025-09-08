const ShortsHeader = () => {
  return (
    <header className="header">
      <button className="back-btn">
        <i className="fas fa-arrow-left"></i>
      </button>
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="검색어를 입력해주세요." />
      </div>
      <button className="profile-btn">
        <i className="fas fa-user"></i>
      </button>
    </header>
  );
};
export default ShortsHeader;
