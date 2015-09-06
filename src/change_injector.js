/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="Parser.ts" />
var vanilla;
$(function () { return setTimeout(function () {
    vanilla = $("html").clone();
    chrome.storage.local.get(location.href, function (items) {
        if (!items) {
            return;
        }
        console.log(items);
        apply(items[location.href]);
    });
}, 300); });
function apply(dif) {
    new Parser(dif).parse().forEach(function (modification) {
        modification.execute();
    });
}
function remove() {
    $("html").replaceWith(vanilla);
    vanilla = vanilla.clone();
}
//# sourceMappingURL=change_injector.js.map