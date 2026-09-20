import { useState, useEffect } from "react";

export default function useStorageValue<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if(!chrome.storage) {
      // alert("No actions available. This app only works as a chrome extension. This only a demo. Please install it as an extension to use it's features.");
      
      return ;
    };
    chrome.storage.local.get(key).then((result) => {
      if (result[key] !== undefined) {
        setValue(result[key] as T);
        console.log(JSON.stringify(result[key]));
      }
    });

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local" || !changes[key]) return;

      setValue(changes[key].newValue as T);
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [key]);

  return [value, setValue] as const;
}