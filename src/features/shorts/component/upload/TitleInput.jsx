// 제목 컴포넌트
const TitleInput = ({ title, onTitleChange, maxLength = 50 }) => {
  return (
    <div className="form-group">
      <label htmlFor="titleInput" className="form-label">
        제목
      </label>
      <input
        type="text"
        id="titleInput"
        className="form-input"
        placeholder="글 제목"
        maxLength={maxLength}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
    </div>
  );
};

export default TitleInput;
