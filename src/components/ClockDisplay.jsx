import Digit from "./Digit";
import Separator from "./Separator";

function ClockDisplay({ digits, animationMode, period, showDate, dateLabel }) {
  return (
    <section className="clock-stack" aria-label="Current time">
      <div className="clock-display">
        <Digit value={digits[0]} animationMode={animationMode} />
        <Digit value={digits[1]} animationMode={animationMode} />
        <Separator />
        <Digit value={digits[2]} animationMode={animationMode} />
        <Digit value={digits[3]} animationMode={animationMode} />
        <Separator />
        <Digit value={digits[4]} animationMode={animationMode} />
        <Digit value={digits[5]} animationMode={animationMode} />
        {period && <span className="period-badge">{period}</span>}
      </div>
      {showDate && <div className="date-strip">{dateLabel}</div>}
    </section>
  );
}

export default ClockDisplay;
