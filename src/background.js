/// <reference path="../typings/chrome/chrome.d.ts" />
console.log("test");
chrome.tabs.onUpdated.addListener(function (tabID, activeInfo, tab) {
    console.log("updated");
    chrome.pageAction.show(tabID);
});
chrome.pageAction.onClicked.addListener(function () {
    chrome.tabs.executeScript(null, { file: "src/edit_injector.js" });
    console.log("clicked");
});
//# sourceMappingURL=background.js.map