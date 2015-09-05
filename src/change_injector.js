/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="Parser.ts" />
chrome.storage.sync.set({ "https://www.google.com/": { changes: "+0@<p>test</p>" } });
$(function () { return setTimeout(function () {
    chrome.storage.sync.get(location.href, function (items) {
        if (items) {
            return;
        }
        new Parser(items[location.href]["changes"]).parse().forEach(function (modification) {
            modification.execute();
        });
    });
}, 1000); });
//# sourceMappingURL=change_injector.js.map