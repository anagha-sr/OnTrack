type LoopTimeDisplayProps = {
  workDuration: number;
  setWorkDuration: (duration: number) => void;
  restDuration: number;
  setRestDuration: (duration: number) => void;
};
function LoopSetTimer({
  workDuration,
  setWorkDuration,
  restDuration,
  setRestDuration,
}: LoopTimeDisplayProps) {
  const formatTime = () => {
    const workHours = Math.floor(workDuration / 3600);
    const workMinutes = Math.floor((workDuration % 3600) / 60);
    const workSeconds = Math.floor(workDuration % 60);

    const restHours = Math.floor(restDuration / 3600);
    const restMinutes = Math.floor((restDuration % 3600) / 60);
    const restSeconds = Math.floor(restDuration % 60);
    return {
      workHours: String(workHours).padStart(2, "0"),
      workMinutes: String(workMinutes).padStart(2, "0"),
      workSeconds: String(workSeconds).padStart(2, "0"),
      restHours: String(restHours).padStart(2, "0"),
      restMinutes: String(restMinutes).padStart(2, "0"),
      restSeconds: String(restSeconds).padStart(2, "0"),
    };
  };
  const {
    workHours,
    workMinutes,
    workSeconds,
    restHours,
    restMinutes,
    restSeconds,
  } = formatTime();
  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const id = event.target.id;
    let value = parseInt(event.target.value) || 0;
    if(value<parseInt(event.target.min)){
      value=parseInt(event.target.min)
    }
    else if(value>parseInt(event.target.max)){
      value=parseInt(event.target.max)
    }
    if (id === "work-hours") {
      const reminder = workDuration % 3600;
      setWorkDuration(value * 3600 + reminder);
    }
    if (id === "work-minutes") {
      const hours = Math.floor(workDuration / 3600);
      const reminder = workDuration % 60;
      setWorkDuration(hours * 3600 + value * 60 + reminder);
    }
    if (id === "work-seconds") {
      const minutes = Math.floor(workDuration / 60);
      setWorkDuration(minutes * 60 + value);
    }

    if (id === "rest-hours") {
      const reminder = restDuration % 3600;
      setRestDuration(value * 3600 + reminder);
    }
    if (id === "rest-minutes") {
      const hours = Math.floor(restDuration / 3600);
      const reminder = restDuration % 60;
      setRestDuration(hours * 3600 + value * 60 + reminder);
    }
    if (id === "rest-seconds") {
      const minutes = Math.floor(restDuration / 60);
      setRestDuration(minutes * 60 + value);
    }
  };
  return (
    <div className="timer-display-container w-full">
      <div className={`timer-display w-full flex flex-col justify-center align-center`}>
        <fieldset className="flex gap-2 justify-center">
          <legend className="pt-4 pb-2">Work Duration:</legend>
          <div className="flex">
            <div className="tooltip-wrapper">
              <label htmlFor="work-hours" className="tooltip">Hours</label>
              <input
                id="work-hours"
                type="number"
                value={workHours}
                onChange={handleDurationChange}
                min="0"
                max="23"
                step="1"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
    <span aria-hidden>:</span>
            <div className="tooltip-wrapper">
              <label htmlFor="work-minutes" className="tooltip">Minutes</label>
              <input
                id="work-minutes"
                type="number"
                value={workMinutes}
                onChange={handleDurationChange}
                min="0"
                max="59"
                step="1"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
                     <span aria-hidden>:</span>

            <div className="tooltip-wrapper">
              <label htmlFor="work-seconds" className="tooltip">Seconds</label>
              <input
                id="work-seconds"
                type="number"
                value={workSeconds}
                onChange={handleDurationChange}
                min="0"
                max="59"
                step="1"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="flex gap-2 justify-center">
          <legend className="pt-4 pb-2">Rest Duration:</legend>
          <div className="timer-display flex ">
            <div className="tooltip-wrapper">
              <label htmlFor="rest-hours" className="tooltip">Hours</label>
              <input
                id="rest-hours"
                type="number"
                value={restHours}
                onChange={handleDurationChange}
                min="0"
                max="23"
                step="1"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
            <span aria-hidden>:</span>
  
            <div className="tooltip-wrapper">
              <label htmlFor="rest-minutes" className="tooltip">Minutes</label>
              <input
                id="rest-minutes"
                type="number"
                value={restMinutes}
                onChange={handleDurationChange}
                min="0"
                max="59"
                step="1"
                 onClick={(e) => e.currentTarget.select()}
              />
            </div>
            <span aria-hidden>:</span>
   
            <div className="tooltip-wrapper">
              <label htmlFor="rest-seconds" className="tooltip">Seconds</label>
              <input
                id="rest-seconds"
                type="number"
                value={restSeconds}
                onChange={handleDurationChange}
                min="0"
                max="59"
                step="1"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
export default LoopSetTimer;
