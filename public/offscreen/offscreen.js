  const audio = new Audio(chrome.runtime.getURL("sounds/notify.wav"));
  audio.currentTime = 0;
  audio.loop = true;
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "PLAY_SOUND") {
    audio.play();
  } else if (message.type === "STOP_SOUND") {
    audio.pause();
    audio.currentTime = 0;
  }
});
