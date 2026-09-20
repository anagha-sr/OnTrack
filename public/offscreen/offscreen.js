chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "PLAY_SOUND") {
    const audio = new Audio(
      chrome.runtime.getURL("sounds/notify.wav")
    );
    audio.play();
  }
});