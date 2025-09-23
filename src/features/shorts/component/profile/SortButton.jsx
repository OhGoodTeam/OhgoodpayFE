const SortButton = ({ item, sortBy, setSortBy }) => {
  return (
    <button
      className={`sort-btn ${item.value === sortBy ? "active" : ""}`}
      data-sort={item.value}
      onClick={() => setSortBy(item.value)}
    >
      {item.label}
    </button>
  );
};

export default SortButton;
