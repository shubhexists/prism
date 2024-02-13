"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = void 0;
class Layer {
    constructor(path, handler) {
        this.method = null;
        this.handler = handler;
        this.path = path;
    }
    handleRequest(req, res) {
        const handler = this.handler;
        handler ? handler(req, res) : null;
    }
    matchPath(path) {
        const setupPath = this.path.split("/");
        const currentPath = path.split("/");
        let match = true;
        let params = {};
        for (let i = 0; i < setupPath.length; i++) {
            var route = setupPath[i];
            var path = currentPath[i];
            if (route[0] === ":") {
                params[route.substr(1)] = path;
            }
            else if (route === "*") {
                break;
            }
            else if (route !== path) {
                match = false;
                break;
            }
        }
        return match ? { matched: true, params } : { matched: false };
    }
}
exports.Layer = Layer;
