"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const layer_1 = require("./layer");
class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.method = {};
    }
    routeHandler(method) {
        const name = method.toLowerCase();
        return Boolean(this.method[name]);
    }
    get(callback) {
        const layer = new layer_1.Layer("/", callback);
        layer.method = "get";
        this.method["get"] = true;
        this.stack.push(layer);
        return this;
    }
    post(callback) {
        const layer = new layer_1.Layer("/", callback);
        layer.method = "post";
        this.method["post"] = true;
        this.stack.push(layer);
        return this;
    }
    put(callback) {
        const layer = new layer_1.Layer("/", callback);
        layer.method = "put";
        this.method["put"] = true;
        this.stack.push(layer);
        return this;
    }
    delete(callback) {
        const layer = new layer_1.Layer("/", callback);
        layer.method = "delete";
        this.method["delete"] = true;
        this.stack.push(layer);
        return this;
    }
    dispatch(req, res, params) {
        var _a;
        const method = (_a = req.method) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        this.stack.forEach((layer) => {
            if (layer.method === method) {
                layer.handleRequest(req, res);
            }
        });
    }
}
exports.Route = Route;
