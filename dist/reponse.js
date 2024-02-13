"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
function response(res) {
    function end(content) {
        res.setHeader("Content-Length", content.length);
        res.status(res.statusCode);
        res.end(content);
        return res;
    }
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.send = (content) => {
        res.setHeader("Content-Type", "text/html");
        return end(content);
    };
    res.json = (content) => {
        try {
            content = JSON.stringify(content);
        }
        catch (err) {
            throw err;
        }
        res.setHeader("Content-Type", "application/json");
        return end(content);
    };
    res.redirect = (url) => {
        res.setHeader("Location", url);
        res.status(301);
        res.end();
        return res;
    };
}
exports.response = response;
