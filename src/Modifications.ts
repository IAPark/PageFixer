/// <reference path="../typings/jquery/jquery.d.ts" />


class Modification{
    constructor(line: string) {
    }
    execute(){
        throw "not implemented";
    }
}

class DomLocation{
    layers: Array<number> = [];
    private element: JQuery;
    constructor(location: string, private root: JQuery){
        this.layers = location.split(" ").map((layer) => parseInt(layer));
        this.element = this.root;

        this.layers.forEach( (layer) => {
            this.element = $(this.element.children()[layer]);
        });
    }

    getElement(): JQuery{
        return this.element;
    }
}

class LocationModification extends Modification{
    domLocation: DomLocation;
    constructor(line: string, root: JQuery){
        super(line);

        this.domLocation = new DomLocation(line.split("@")[0], root);
    }
}

class Add extends LocationModification {
    to_add: string;
    constructor(line:string, root: JQuery) {
        super(line, root);

        this.to_add = line.split("@").slice(1, line.length).join("@");
    }

    execute(){
        this.domLocation.getElement().before(this.to_add);
    }
}

class Remove extends LocationModification {
    constructor(line:string, root: JQuery) {
        super(line, root);
    }

    execute(){
        this.domLocation.getElement().detach();
    }
}

class ParamModification extends LocationModification{
    command: string;

    constructor(line:string, root: JQuery) {
        super(line, root);
        this.command = line.split('@').slice(1).join('@');
    }

    execute(){
        let param = this.command.split('=')[0];

        this.domLocation.getElement().get(0).params[param] = this.command.split('=').slice(1).join('=');


        var working = this.domLocation.getElement().get(0).params;
        for(var i = 0; i< param.length-1; ++i){
            working = working[param[i]];
        }

        working[param[param.length-1]] = this.command.split('=').slice(1).join('=');
    }
}

class AttributeModification extends LocationModification{
    command: string;

    constructor(line:string, root: JQuery) {
        super(line, root);
        this.command = line.split('@').slice(1).join('@');
        console.log("AttributeModification")
    }

    execute(){
        let attribute = this.command.split('=')[0].split('.');

        console.log(this.command.split('=').slice(1).join('='));
        var working = this.domLocation.getElement().get(0);
        for(var i = 0; i< attribute.length-1; ++i){
            working = working[attribute[i]];
        }

        working[attribute[attribute.length-1]] = this.command.split('=').slice(1).join('=');
    }
}
