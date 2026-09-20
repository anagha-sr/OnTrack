export async function playSound() {
  const exists = await chrome.offscreen.hasDocument();

  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "offscreen/offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play timer completion sound",
    });
  }

 await chrome.runtime.sendMessage({
    type: "PLAY_SOUND",
  });
  setTimeout(stopSound, 30000);
}

export async function stopSound() {
  const exists = await chrome.offscreen.hasDocument();
  if (exists) {
   await chrome.runtime.sendMessage({
      type: "STOP_SOUND",
    });
   await chrome.offscreen.closeDocument();
  }
}
