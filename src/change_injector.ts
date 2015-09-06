/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="Parser.ts" />

var vanilla;

$(() => setTimeout(() => {
    vanilla = $("html").clone();

    chrome.storage.local.get(location.href, (items: Object) => {
        if(!items) {
            return;
        }
        console.log(items);

        apply(items[location.href]);
    });
}, 500));

function apply(dif: string) {
    new Parser(dif).parse().forEach((modification) => {
        modification.execute();
    });
}

function remove() {
    $("html").replaceWith(vanilla);
    vanilla = vanilla.clone()
}