"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const layer_1 = require("./layer");
const route_1 = require("./route");
class Router {
    constructor() {
        this.stack = [
            new layer_1.Layer("*", (req, res) => {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end(`Cannot find ${req.url}`);
            }),
        ];
    }
    handle(req, res) {
        const method = req.method;
        let found = false;
        for (let i = 1; i < this.stack.length; i++) {
            const layer = this.stack[i];
            let { matched = false, params = {} } = layer.matchPath(req.url);
            if (matched && layer.route && layer.route.routeHandler(method)) {
                found = true;
                // console.log({ matched, params });
                req.params = params;
                layer.handleRequest(req, res);
                break;
            }
            else if (matched) {
                res.statusCode = 405;
                res.setHeader("Content-Type", "text/plain");
                res.end(`Cannot ${method} ${req.url}`);
                break;
            }
            else {
                this.stack[0].handleRequest(req, res);
                break;
            }
        }
    }
    route(path) {
        const route = new route_1.Route(path);
        const layer = new layer_1.Layer(path, (req, res, params) => {
            route.dispatch(req, res, params);
        });
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
    get(path, callback) {
        const route = this.route(path);
        route.get(callback);
        return this;
    }
    post(path, callback) {
        const route = this.route(path);
        route.post(callback);
        return this;
    }
    put(path, callback) {
        const route = this.route(path);
        route.put(callback);
        return this;
    }
    delete(path, callback) {
        const route = this.route(path);
        route.delete(callback);
        return this;
    }
}
exports.Router = Router;
