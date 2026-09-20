function LoopRunningTimer({ remaining }: { remaining: number }) {
  const formatTime = () => {
    let displayTime = remaining;
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
  return (
        <div className={`timer-display mt-4 flex justify-center gap-2 `} >
      <div className="tooltip-wrapper">
        <label htmlFor="hours" className="tooltip">Hours</label>
        <input
          id="hours"
          type="number"
          value={hours}
          // onChange={handleDurationChange}
          min="0"
          max="23"
          step="1"
          disabled
        />
      </div>
            <span aria-hidden>:</span>

      <div className="tooltip-wrapper">
        <label htmlFor="minutes" className="tooltip">Minutes</label>
        <input
          id="minutes"
          type="number"
          value={minutes}
          // onChange={handleDurationChange}
          min="0"
          max="59"
          step="1"
          disabled
        />
      </div>
            <span aria-hidden>:</span>

      <div className="tooltip-wrapper">
        <label htmlFor="seconds" className="tooltip">Seconds</label>
        <input
          id="seconds"
          type="number"
          value={seconds}
          // onChange={handleDurationChange}
          min="0"
          max="59"
          step="1"
          disabled
        />
      </div>
    </div>
    //check what was wrong with this
    // <div className="timer-display flex justify-center items-center">
    //   <fieldset className="flex gap-2 justify-center">
    //     <div className="tooltip-wrapper">
    //       <label htmlFor="hours" className="tooltip">
    //         Hours
    //       </label>
    //       <input
    //         type="number"
    //         id="hours"
    //         value={hours}
    //         disabled
    //         aria-label="hours"
    //       />
    //     </div>
    //     <span>:</span>
    //     <div className="tooltip-wrapper">
    //       <label htmlFor="minutes" className="tooltip">
    //         Minutes
    //       </label>
    //       <input
    //         type="number"
    //         id="minutes"
    //         value={minutes}
    //         aria-label="minutes"
    //         disabled
    //       />
    //     </div>
    //     <span>:</span>
    //     <div className="tooltip-wrapper">
    //       <label htmlFor="seconds" className="tooltip">
    //         Seconds
    //       </label>
    //       <input
    //         type="number"
    //         id="seconds"
    //         value={seconds}
    //         aria-label="seconds"
    //         disabled
    //       />
    //     </div>
    //   </fieldset>
    // </div>
  );
}
export default LoopRunningTimer;
