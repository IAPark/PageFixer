/// <reference path="../typings/jquery/jquery.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Modification = (function () {
    function Modification(line) {
    }
    Modification.prototype.execute = function () {
        throw "not implemented";
    };
    return Modification;
})();
var DomLocation = (function () {
    function DomLocation(location, root) {
        var _this = this;
        this.root = root;
        this.layers = [];
        this.layers = location.split(" ").map(function (layer) { return parseInt(layer); });
        this.element = this.root;
        this.layers.forEach(function (layer) {
            _this.element = $(_this.element.children()[layer]);
        });
    }
    DomLocation.prototype.getElement = function () {
        return this.element;
    };
    return DomLocation;
})();
var LocationModification = (function (_super) {
    __extends(LocationModification, _super);
    function LocationModification(line, root) {
        _super.call(this, line);
        this.domLocation = new DomLocation(line.split("@")[0], root);
    }
    return LocationModification;
})(Modification);
var Add = (function (_super) {
    __extends(Add, _super);
    function Add(line, root) {
        _super.call(this, line, root);
        this.to_add = line.split("@").slice(1, line.length).join("@");
    }
    Add.prototype.execute = function () {
        this.domLocation.getElement().before(this.to_add);
    };
    return Add;
})(LocationModification);
var Remove = (function (_super) {
    __extends(Remove, _super);
    function Remove(line, root) {
        _super.call(this, line, root);
    }
    Remove.prototype.execute = function () {
        this.domLocation.getElement().detach();
    };
    return Remove;
})(LocationModification);
var ParamModification = (function (_super) {
    __extends(ParamModification, _super);
    function ParamModification(line, root) {
        _super.call(this, line, root);
        this.command = line.split('@').slice(1).join('@');
    }
    ParamModification.prototype.execute = function () {
        var param = this.command.split('=')[0];
        this.domLocation.getElement().get(0).params[param] = this.command.split('=').slice(1).join('=');
    };
    return ParamModification;
})(LocationModification);
var AttributeModification = (function (_super) {
    __extends(AttributeModification, _super);
    function AttributeModification(line, root) {
        _super.call(this, line, root);
        this.command = line.split('@').slice(1).join('@');
        console.log("AttributeModification");
    }
    AttributeModification.prototype.execute = function () {
        var attribute = this.command.split('=')[0].split('.');
        console.log(this.command.split('=').slice(1).join('='));
        var working = this.domLocation.getElement().get(0);
        for (var i = 0; i < attribute.length - 1; ++i) {
            working = working[attribute[i]];
        }
        working[attribute[attribute.length - 1]] = this.command.split('=').slice(1).join('=');
    };
    return AttributeModification;
})(LocationModification);
//# sourceMappingURL=Modifications.js.map