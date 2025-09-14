import './ChatToggle.css';

const ChatToggle = ({
  options,
  activeToggle,
  onToggleClick,
  disabled = false
}) => {
  return (
    <div className="toggle-container">
      {options.map((option) => (
        <button
          key={option}
          className={`toggle-btn ${activeToggle === option ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onToggleClick(option)}
          disabled={disabled}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChatToggle;