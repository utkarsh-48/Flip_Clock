function FontMenu({ font, setFont, FONT_OPTIONS }) {
  return (
    <div className="menu-section">
      <span className="menu-title">Font</span>
      <label className="select-label wide-select">
        <span>Digits</span>
        <select value={font} onChange={(event) => setFont(event.target.value)}>
          {FONT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FontMenu;
