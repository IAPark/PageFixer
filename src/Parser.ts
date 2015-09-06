/// <reference path="Modifications.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />


class Parser{
    public data: Object;

    constructor(private file: string){

    }

    parse(): Array<Modification>{
        var lines = this.file.split("\n");
        lines = lines.map( (line) => line.trim());
        lines = lines.filter( (line) => !(line === ""));
        return this.parseRoot(lines, $("html")).m;
    }

    parseRoot(lines: Array<string>, root: JQuery): {m: Array<Modification>, i: number}{
        var modifications: Array<Modification> = [];

        for(var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            if (line.charAt(0) === "+") {
                modifications.push(new Add(line.slice(1), root))
            } else if (line.charAt(0) === "-") {
                modifications.push(new Remove(line.slice(1), root))
            } else if (line.charAt(0) === "{") {
                var child = this.parseRoot(lines.slice(i + 1), new DomLocation(line.slice(1), root).getElement());
                i+=child.i;
                modifications = modifications.concat(child.m);
            } else if (line.charAt(0) === "}") {
                break;
            } else if (line.charAt(0) === "r") {
                var child: {m: Array<Modification>, i: number} = {i: 0, m: []};
                new DomLocation(line.slice(1), root).getElement().children().each((j, e) => {
                    i-=child.i;
                    child = this.parseRoot(lines.slice(i + 1), $(e));
                    modifications = modifications.concat(child.m);
                    i+=child.i;
                });
            } else if (line.charAt(0) === "p"){
                modifications.push(new ParamModification(line.slice(1), root));
            } else if (line.charAt(0) === "a"){
                modifications.push(new AttributeModification(line.slice(1), root));
            }
        }

        return {m: modifications, i: i};
    }
}