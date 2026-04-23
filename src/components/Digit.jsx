import { useEffect, useRef, useState } from "react";

function Digit({ value, animationMode }) {
  const [previousValue, setPreviousValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const displayRef = useRef(value);
  const midpointRef = useRef(0);
  const finishRef = useRef(0);

  useEffect(() => {
    if (value === displayRef.current) return undefined;

    window.clearTimeout(midpointRef.current);
    window.clearTimeout(finishRef.current);

    if (animationMode === "simple") {
      setPreviousValue(displayRef.current);
      displayRef.current = value;
      setDisplayValue(value);
      setIsFlipping(false);
      return undefined;
    }

    setPreviousValue(displayRef.current);
    setIsFlipping(true);

    midpointRef.current = window.setTimeout(() => {
      displayRef.current = value;
      setDisplayValue(value);
    }, 300);

    finishRef.current = window.setTimeout(() => {
      setIsFlipping(false);
    }, 660);

    return () => {
      window.clearTimeout(midpointRef.current);
      window.clearTimeout(finishRef.current);
    };
  }, [animationMode, value]);

  return (
    <div
      className={`digit ${isFlipping ? "is-flipping" : ""}`}
      aria-label={displayValue}
    >
      <div className="digit-half digit-static digit-top">
        <span>{displayValue}</span>
      </div>
      <div className="digit-half digit-static digit-bottom">
        <span>{displayValue}</span>
      </div>
      <div className="digit-divider" />
      {animationMode === "real" && (
        <>
          <div className="digit-half digit-animated digit-animated-top">
            <span>{previousValue}</span>
          </div>
          <div className="digit-half digit-animated digit-animated-bottom">
            <span>{value}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Digit;
