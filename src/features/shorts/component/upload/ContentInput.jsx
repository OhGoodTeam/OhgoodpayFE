// 내용 입력 컴포넌트
const ContentInput = ({ content, onContentChange, maxLength = 150 }) => {
  return (
    <div className="form-group">
      <label htmlFor="contentInput" className="form-label">
        내용
      </label>
      <div className="content-input-wrapper">
        <textarea
          id="contentInput"
          className="form-textarea"
          placeholder="설명을 추가하세요..."
          maxLength={maxLength}
          rows={4}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
        <div className="char-count" id="charCount">
          {content.length} / {maxLength}
        </div>
      </div>
    </div>
  );
};

export default ContentInput;
