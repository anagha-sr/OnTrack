import type { SingleTimerStatus } from "../../../types/singleTimerTypes";
//all times passed are in seconds
type TimeDisplayProps = {
  duration: number; // in seconds
  remaining: number; // in seconds
  setDuration: (duration: number) => void; // set duration in seconds
  timerStatus: SingleTimerStatus;
};
function TimerDisplay({
  duration,
  remaining,
  setDuration,
  timerStatus,
}: TimeDisplayProps) {
  const formatTime = () => {
    let displayTime = remaining;
    if (timerStatus === "idle") {
      displayTime = duration;
    }
    else if (timerStatus === "completed") {
      displayTime = 0;
    }
    
    const hours = Math.floor(displayTime / 3600);
    const minutes = Math.floor((displayTime % 3600) / 60);
    const seconds = Math.floor(displayTime % 60);
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };

  };
  const { hours, minutes, seconds } = formatTime();
  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    let value = parseInt(event.target.value) || 0;
    if(value<parseInt(event.target.min)){
      value=parseInt(event.target.min)
    }
    else if(value>parseInt(event.target.max)){
      value=parseInt(event.target.max)
    }
    if (id === "hours") {
      const reminder = duration % 3600;
      setDuration(value * 3600 + reminder);
    }
    if (id === "minutes") {
      const hours = Math.floor(duration / 3600);
      const reminder = duration % 60;
      setDuration(hours * 3600 + value * 60 + reminder);
    }
    if (id === "seconds") {
      const minutes = Math.floor(duration / 60);
      setDuration(minutes * 60 + value);
    }
  };

  return (
    <div className={`timer-display mt-4 flex justify-center gap-2 ${timerStatus === "completed" ? "completed" : ""}`} >
      <div className="tooltip-wrapper">
        <label htmlFor="hours" className="tooltip">Hours</label>
        <input
          id="hours"
          type="number"
          value={hours}
          onChange={handleDurationChange}
          min="0"
          max="23"
          step="1"
          disabled={timerStatus !== "idle"}
        />
      </div>
            <span aria-hidden>:</span>

      <div className="tooltip-wrapper">
        <label htmlFor="minutes" className="tooltip">Minutes</label>
        <input
          id="minutes"
          type="number"
          value={minutes}
          onChange={handleDurationChange}
          min="0"
          max="59"
          step="1"
          disabled={timerStatus !== "idle"}
        />
      </div>
            <span aria-hidden>:</span>

      <div className="tooltip-wrapper">
        <label htmlFor="seconds" className="tooltip">Seconds</label>
        <input
          id="seconds"
          type="number"
          value={seconds}
          onChange={handleDurationChange}
          min="0"
          max="59"
          step="1"
          disabled={timerStatus !== "idle"}
        />
      </div>
    </div>
  );
}

export default TimerDisplay;
