import { useRef } from "react";

function UploadBackground({ setBackground }) {
  const fileInputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBackground(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="background-choice">
      <button
        type="button"
        className="pill-button"
        onClick={() => fileInputRef.current?.click()}
      >
        Choose image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        hidden
      />
    </div>
  );
}

export default UploadBackground;
