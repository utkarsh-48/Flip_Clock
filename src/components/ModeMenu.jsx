import IconAsset from "./IconAsset";

function ModeMenu({ mode, setMode, MODES, MODE_ICONS }) {
  return (
    <div className="menu-section">
      <span className="menu-title">Mode</span>
      <div className="icon-grid">
        {MODES.map((item) => (
          <button
            key={item}
            type="button"
            className={`menu-choice ${item === mode ? "active" : ""}`}
            onClick={() => setMode(item)}
            aria-label={item}
            title={item}
          >
            <IconAsset icon={MODE_ICONS[item]} alt="" />
            <small>{item}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ModeMenu;
