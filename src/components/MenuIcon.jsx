import React from "react";
import IconAsset from "./IconAsset";

function MenuIcon({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      className={`menu-icon ${active ? "active" : ""}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <IconAsset icon={icon} alt="" />
    </button>
  );
}

export default MenuIcon;
