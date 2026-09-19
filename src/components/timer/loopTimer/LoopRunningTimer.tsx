
function LoopRunningTimer({remaining}: {remaining: number}) {
      
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
  return <div className="timer-display flex ">
      <input
      type="number"
      id="hours"
      value={hours}
      readOnly
      area-label="hours"
    /> :
    <input
      type="number"
      id="hours"
      value={minutes}
      area-label="minutes"
      readOnly
    /> :
    <input
      type="number"
      id="hours"
      value={seconds}
      area-label="seconds"
      readOnly
    />

  </div>;
}
export default LoopRunningTimer;
