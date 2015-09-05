/// <reference path="../typings/chrome/chrome.d.ts" />
console.log("test");

chrome.tabs.onUpdated.addListener((tabID:number, activeInfo:chrome.tabs.TabActiveInfo, tab:chrome.tabs.Tab) => {
    console.log("updated");
    chrome.pageAction.show(tabID);
});
chrome.pageAction.onClicked.addListener(() => {
    chrome.tabs.executeScript(null, {file: "src/edit_injector.js"});
    console.log("clicked");
});