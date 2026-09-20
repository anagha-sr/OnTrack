export default async function setBadge() {
// const { popupOpen } = await chrome.storage.session.get("popupOpen");
//   if (popupOpen) return;
  await chrome.action.setBadgeText({ text: "!" });
  await chrome.action.setBadgeTextColor({ color: "#FFECBD" });
  await chrome.action.setBadgeBackgroundColor({ color: "#183B4A" })
}