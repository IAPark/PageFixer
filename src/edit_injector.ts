/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="Parser.ts" />
/// <reference path="change_injector.ts" />


var dif = "";
var repeating_includes: Array<JQuery> = [];

chrome.storage.local.get(location.href, (items:Object) => {
    if(dif) {
        dif = items[location.href].dif;
    }
});

$(() => {
    $("head").append(`
    <style>


        .no-border{
            border-style: none;
            border-width: 0;
            border-color: black;
        }
    </style>
    `);

    setTimeout(() => {
        editor_remove();
        editor_apply();
    }, 500)

});

function editor_apply() {
    apply(dif);
    add_for_element($("body"), "1");
}

function editor_remove() {
    remove();
    $.contextMenu( 'destroy' );
}

function add_for_element(root:JQuery, higher:string) {
    root.children().each((index, element) => {

        // suggested by http://stackoverflow.com/questions/3442394/jquery-using-text-to-retrieve-only-text-not-nested-in-child-tags
        /*if($(element).clone()    //clone the element
                .children() //select all the children
                .remove()   //remove all the children
                .end()  //again go back to selected element
                .text() == "") {
            return;
        }*/

        // based on a suggestion here http://stackoverflow.com/questions/3442394/jquery-using-text-to-retrieve-only-text-not-nested-in-child-tags
        let domLocation = (higher + " " + index).trim();

        add_for_element($(element), domLocation);


        let menu_class = "menu-" + domLocation.replace(/ /g, "-");
        $(element).addClass(menu_class);

        $.contextMenu({
            selector: '.'+menu_class,
            callback: function (key, options) {
                if(key === "add") {
                    let html = window.prompt("HTML to add:", "<p>Hello World</p>");
                    dif += "\n+" + domLocation + "@" + html;
                }else if(key == "repeating") {
                    repeating_includes.push($(element));
                } else if(key === "remove"){
                    dif+="\n-" + domLocation;
                } else if (key == "save"){
                    save();
                }

                editor_remove();
                editor_apply();
            },
            items: {
                "add": {name: "Add"},
                "remove": {name: "Remove"},
                "repeating": {name: "Repeating"},
                "save": {name: "Save"}
            }
        });
    });}

function save(){
    var location_to_save = location.href;
        console.log(location_to_save);
    console.log(dif);
    chrome.storage.local.remove(location_to_save);
    let result = {};
    result[location_to_save] = dif;
    chrome.storage.local.set(result, () => {
        console.log("saved");
        chrome.storage.local.get(location_to_save, (items) => console.log(items))
    });
}