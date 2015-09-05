/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="Parser.ts" />

chrome.storage.sync.set({"https://www.google.com/": {changes: "+0@<p>test</p>"}});

$(()=> setTimeout(() => {
    chrome.storage.sync.get(location.href, (items: Object) => {
        if(items) {
            return;
        }

        new Parser(items[location.href]["changes"]).parse().forEach((modification) => {
                modification.execute();
            });
    });
}, 1000));