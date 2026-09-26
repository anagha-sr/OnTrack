import JotContent from "../components/jots/JotContent";
import useStorageValueReadOnly from "../hooks/useStorageReadOnly";
import type { Jot } from "../types/jotsType";

export default function JotsPage() {
  const jots = useStorageValueReadOnly<Jot[]>("jots") ?? [];
  const handleUpdate = (
    id: string,
    content: string,
  ) => {
    chrome.runtime.sendMessage({ type: "UPDATE_JOTS", id, content });
  };
  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this jot?"))
   {try{ chrome.runtime.sendMessage({ type: "DELETE_JOTS", id });}
    catch (error) {
      console.error("delete jots error:",error);
    }}

  };
  const handleAdd = (content: string) => {
    chrome.runtime.sendMessage({ type: "ADD_JOTS", content });
  };
  return (
    <div className="section flex flex-col justify-center items-center">
      <h1 className="sr-only">Jots</h1>
      <div className="tooltip-wrapper my-4">
        <button
          onClick={() => handleAdd("")}
          className=" btn btn-round btn-outline"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <span className="tooltip">Add</span>
      </div>
      {jots?.length === 0 ? (
        <p className="empty-state">No jots yet.</p>
      ) : (
        <div className="jots-list">
          {jots &&
            Object.entries(jots)?.sort((a, b) => b[1].timeStamp - a[1].timeStamp).map(([key, jot]) => (
              <div className="flex flex-col mb-4" key={key} >
                {/* <span className="jot-time">
                  {new Date(jot.timeStamp).toLocaleString()}
                </span> */}
                {/* copy to clipboard */}
                <div className="flex justify-between -mb-1.5">
                    <div className="tooltip-wrapper">
                        <button
                          onClick={() => navigator.clipboard.writeText(jot.content)}
                          className=" btn btn-text "
                        >
                          <span className="material-symbols-outlined">content_copy</span>
                        </button>
                        <span className="tooltip">Copy</span>
                    </div>
                      <div className="tooltip-wrapper ml-auto">
                      <button
                        onClick={() => handleDelete(key)}
                        className=" btn btn-text"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <span className="tooltip">Delete</span>
                    </div>
                </div>
                <JotContent content={jot.content} id={key} handleUpdate={handleUpdate} />
                
              
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
