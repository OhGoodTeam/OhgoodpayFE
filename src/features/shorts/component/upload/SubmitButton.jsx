// 작성완료 버튼
const SubmitButton = ({ onSubmit, isDisabled, isSubmitting }) => {
  return (
    <div className="upload-footer">
      <button
        className="complete-btn"
        id="completeBtn"
        onClick={onSubmit}
        disabled={isDisabled || isSubmitting}
      >
        {isSubmitting ? "업로드 중..." : "작성 완료"}
      </button>
    </div>
  );
};

export default SubmitButton;
