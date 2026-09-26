import type { Jots } from "../types/jotsType";
import type { JotsMessage } from "../types/messagesTypes";

async function handleJotsMessage(message: JotsMessage) {
    switch (message.type) {
        case "ADD_JOTS":{
            try {
                const result= await chrome.storage.local.get("jots");
                const jots = result["jots"] as Jots;
                const id = crypto.randomUUID();
                const timestamp = Date.now();
                const content = message.content;
                await chrome.storage.local.set({"jots":{...jots, [id]: {content, timeStamp: timestamp}}});
            }
            catch (error) {
                console.error("add jots error:",error);
            }
            break;
        }
        case "DELETE_JOTS":{
            const result= await chrome.storage.local.get("jots");
            const jots = result["jots"] as Jots;
            const updatedJots = {...jots};
            delete updatedJots[message.id];

            try{await chrome.storage.local.set({"jots":updatedJots});}
            catch (error) {
                console.error("delete jots error:",error);
            }
            break;
        }
        case "UPDATE_JOTS":{
            const result= await chrome.storage.local.get("jots");
            const jots = result["jots"] as Jots;
            let updatedJots = {...jots};
            if(message.id in updatedJots){
               try{ updatedJots[message.id].content = message.content;
                await chrome.storage.local.set({"jots":updatedJots});}
                catch (error) {
                    console.error("update jots error:",error);
                }
            }
            else{
                console.error("jot not found");
            }
            break;
        }
    }
}
export { handleJotsMessage };