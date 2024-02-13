"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prism = void 0;
const http = require("http");
const router_1 = require("./router");
const reponse_1 = require("./reponse");
const request_1 = require("./request");
function Prism() {
    const middleware = [];
    const router = new router_1.Router();
    function use(middlewar) {
        if (typeof middlewar == "function") {
            middleware.push({
                path: "*",
                callbackFunction: middlewar,
            });
            //   console.log(middleware);
        }
        else {
            middleware.push(middlewar);
            //   console.log(middleware);
        }
    }
    function matchPath(path, setup_path) {
        const setupPath = setup_path.split("/");
        const currentPath = path.split("/");
        let match = true;
        // console.log("setupPath - ", setupPath);
        // console.log("currentPath - ", currentPath);
        let params = {};
        for (let i = 1; i < setupPath.length; i++) {
            var route = setupPath[i];
            //   console.log("Route - ", route);
            var path_ = currentPath[i];
            //   console.log("path_ - ", path_);
            if (route.charAt(0) === ":") {
                params[route.substr(1)] = path_;
                // console.log("matched");
            }
            else if (route === "*") {
                // console.log("matched");
                break;
            }
            else if (route !== path_) {
                // console.log("not matched");
                match = false;
                break;
            }
        }
        // console.log({ matched: match, params: match ? params : undefined });
        return match ? { matched: true, params } : { matched: false };
    }
    function findNext(req, res) {
        let current = -1;
        const next = () => {
            current += 1;
            const middlewar = middleware[current];
            const { matched = false, params = {} } = middlewar
                ? matchPath(req.url, middlewar.path)
                : {};
            //   console.log(matched);
            // console.log(current, middleware.length - 1);
            if (matched && current <= middleware.length - 1) {
                // console.log("here");
                req.params = params;
                middlewar.callbackFunction(req, res, next);
            }
            else if (current < middleware.length - 1) {
                next();
            }
            else {
                // console.log(":/ ");
                req.handler(req, res);
            }
        };
        return next;
    }
    function handle(req, res, cb) {
        const next = findNext(req, res);
        req.handler = cb;
        next();
    }
    function get({ path, callbackFunction }) {
        return router.get(path, callbackFunction);
    }
    function post({ path, callbackFunction }) {
        return router.post(path, callbackFunction);
    }
    function listen({ port, callback }) {
        return http
            .createServer((req, res) => {
            (0, reponse_1.response)(res);
            (0, request_1.request)(req);
            handle(req, res, () => {
                router.handle(req, res);
            });
        })
            .listen({ port }, () => {
            if (callback) {
                return callback();
            }
        });
    }
    return {
        use,
        listen,
        get,
        post,
    };
}
exports.Prism = Prism;
