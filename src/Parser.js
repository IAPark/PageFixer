/// <reference path="Modifications.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
var Parser = (function () {
    function Parser(file) {
        this.file = file;
    }
    Parser.prototype.parse = function () {
        var lines = this.file.split("\n");
        lines = lines.map(function (line) { return line.trim(); });
        lines = lines.filter(function (line) { return !(line === ""); });
        return Parser.parseRoot(lines, $("html")).m;
    };
    Parser.parseRoot = function (lines, root) {
        var modifications = [];
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            if (line.charAt(0) === "+") {
                modifications.push(new Add(line.slice(1), root));
            }
            else if (line.charAt(0) === "-") {
                modifications.push(new Remove(line.slice(1), root));
            }
            else if (line.charAt(0) == "{") {
                var child = Parser.parseRoot(lines.slice(i + 1), new DomLocation(line.slice(1), root).getElement());
                i += child.i;
                modifications = modifications.concat(child.m);
            }
            else if (line.charAt(0) == "}") {
                break;
            }
            else if (line.charAt(0) == "c") {
                var child = { i: 0, m: [] };
                new DomLocation(line.slice(1), root).getElement().children().each(function (j, e) {
                    i -= child.i;
                    child = Parser.parseRoot(lines.slice(i + 1), $(e));
                    modifications = modifications.concat(child.m);
                    i += child.i;
                });
            }
        }
        return { m: modifications, i: i };
    };
    return Parser;
})();
//# sourceMappingURL=Parser.js.map