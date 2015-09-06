/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="Parser.ts" />
/// <reference path="change_injector.ts" />
var repeating_includes = [];
var repeating = null;
var repeating_class = null;
var ChangeRecorder = (function () {
    function ChangeRecorder(start) {
        this.roots = [""];
        this.repeating = false;
        this.log = start;
    }
    ChangeRecorder.prototype.add = function (location, element) {
        location = location.slice(this.roots[this.roots.length - 1].length + ((this.repeating) ? 3 : 0));
        this.log += "\n+" + location + "@" + element;
    };
    ChangeRecorder.prototype.remove = function (location) {
        location = location.slice(this.roots[this.roots.length - 1].length + ((this.repeating) ? 3 : 0));
        this.log += "\n-" + location;
    };
    ChangeRecorder.prototype.repeat = function (location) {
        location = location.slice(this.roots[this.roots.length - 1].length + ((this.repeating) ? 3 : 0));
        this.roots.push((this.roots[this.roots.length - 1] + " " + location).trim());
        this.log += "\nr" + location;
        this.repeating = true;
    };
    ChangeRecorder.prototype.attribute = function (location, command) {
        location = location.slice(this.roots[this.roots.length - 1].length + ((this.repeating) ? 3 : 0));
        this.log += "\na" + location + '@' + command;
    };
    ChangeRecorder.prototype.parameters = function (location, command) {
        location = location.slice(this.roots[this.roots.length - 1].length + ((this.repeating) ? 3 : 0));
        this.log += "\np" + location + '@' + command.param + '=' + command.value;
    };
    ChangeRecorder.prototype.end = function () {
        this.log += "\n}";
        this.roots.pop();
        this.repeating = false;
    };
    return ChangeRecorder;
})();
var recorder = new ChangeRecorder("");
$(function () {
    setTimeout(function () {
        editor_remove();
        editor_apply();
    }, 500);
});
function editor_apply() {
    apply(recorder.log);
    add_for_element($("body"), "1");
    if (repeating_class) {
        console.log(repeating_class);
        $("." + repeating_class).css("background-color", "gray");
    }
}
function editor_remove() {
    remove();
    $.contextMenu('destroy');
}
function add_for_element(root, higher) {
    root.children().each(function (index, element) {
        var domLocation = (higher + " " + index).trim();
        add_for_element($(element), domLocation);
        var menu_class = "menu-" + domLocation.replace(/ /g, "-");
        $(element).addClass(menu_class);
        $(element).data("location", domLocation);
        $.contextMenu({
            selector: '.' + menu_class,
            callback: function (key, options) {
                if (key === "add") {
                    var html = window.prompt("HTML to add:", "<p>Hello World</p>");
                    recorder.add(domLocation, html);
                }
                else if (key === "repeating") {
                    repeating_includes.push(element);
                    $(element).css("background-color", "gray");
                    if (repeating_includes.length >= 2) {
                        repeating = getWrapping(repeating_includes);
                        repeating_class = "menu-" + repeating.data("location").replace(/ /g, "-");
                        recorder.repeat(repeating.data("location"));
                        repeating.css("background-color", "gray");
                    }
                }
                else if (key === "remove") {
                    recorder.remove(domLocation);
                }
                else if (key == "param") {
                    var paramValue = window.prompt("Parameter and value", "id=test");
                    recorder.parameters(domLocation, { param: paramValue.split("=")[0], value: paramValue.split("=").slice(1).join('=') });
                }
                else if (key == "attr") {
                    var attrValue = window.prompt("Attribute and value", "style=test");
                    recorder.attribute(domLocation, attrValue);
                }
                else if (key == "save") {
                    save();
                }
                else if (key == "end") {
                    recorder.end();
                    repeating = null;
                    repeating_class = null;
                }
                editor_remove();
                editor_apply();
            },
            items: {
                "add": { name: "Add" },
                "remove": { name: "Remove" },
                "param": { name: "Set Parameters" },
                "attr": { name: "Set Attribute" },
                "repeating": { name: "Repeating" },
                "save": { name: "Save" },
                "end": { name: "End" }
            }
        });
    });
}
function save() {
    var location_to_save = location.href;
    chrome.storage.local.remove(location_to_save);
    var result = {};
    result[location_to_save] = recorder.log;
    chrome.storage.local.set(result, function () {
        chrome.storage.local.get(location_to_save, function (items) { return console.log(items); });
    });
}
function getWrapping(elements) {
    if (elements.length < 2) {
        return;
    }
    return $(elements[0]).parents().has(elements[1]).first();
}
//# sourceMappingURL=edit_injector.js.map