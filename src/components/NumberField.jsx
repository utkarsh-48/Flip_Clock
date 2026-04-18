import React from "react";

function NumberField({ label, value, onChange, max, min = 0 }) {
  return (
    <label className="number-label">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(Math.min(max, Math.max(min, Number(event.target.value))))
        }
      />
    </label>
  );
}

export default NumberField;
