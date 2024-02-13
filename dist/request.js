"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const url = require("url");
function request(req) {
    const parsedUrl = url.parse(`${req.headers.host}${req.url}`, true);
    const reqWithUrl = req;
    Object.keys(parsedUrl).forEach((key) => {
        if (key in parsedUrl && key in reqWithUrl) {
            reqWithUrl[key] = parsedUrl[key];
        }
    });
}
exports.request = request;
