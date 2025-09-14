import './ChatToggle.css';

const ChatToggle = ({
  options,
  activeToggle,
  onToggleClick
}) => {
  return (
    <div className="toggle-container">
      {options.map((option) => (
        <button
          key={option}
          className={`toggle-btn ${activeToggle === option ? 'active' : ''}`}
          onClick={() => onToggleClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChatToggle;