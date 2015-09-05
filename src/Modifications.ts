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
