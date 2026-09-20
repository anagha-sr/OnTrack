export default async function playSound() {
  const exists = await chrome.offscreen.hasDocument();

  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "offscreen/offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play timer completion sound",
    });
  }

  chrome.runtime.sendMessage({
    type: "PLAY_SOUND",
  });

}