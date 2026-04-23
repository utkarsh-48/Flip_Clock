import { useState } from "react";

function LinkBackground({ setBackground }) {
  const [url, setUrl] = useState("");
  const applyUrl = () => {
    const nextUrl = url.trim();
    if (nextUrl) setBackground(nextUrl);
  };

  return (
    <div className="background-choice">
      <input
        className="url-input"
        type="url"
        placeholder="Paste image URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") applyUrl();
        }}
      />
      <button type="button" className="pill-button" onClick={applyUrl}>
        Apply
      </button>
    </div>
  );
}

export default LinkBackground;
