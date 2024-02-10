import { Layer } from "./layer";
import { IncomingMessage, ServerResponse } from "http";
import { Route } from "./route";

export class Router {
  private stack: Array<Layer>;
  constructor() {
    this.stack = [
      new Layer("*", (req: IncomingMessage, res: ServerResponse) => {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end(`Cannot find ${req.url}`);
      }),
    ];
  }

  public handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method!;
    let found = false;
    for (let i = 1; i < this.stack.length; i++) {
      const layer = this.stack[i];
      let { matched = false, params = {} } = layer.matchPath(req.url!);
      if (matched && layer.route && layer.route.routeHandler(method)) {
        found = true;
        console.log({ matched, params });
        layer.handleRequest(req, res, params);
        break;
      } else if (matched) {
        res.statusCode = 405;
        res.setHeader("Content-Type", "text/plain");
        res.end(`Cannot ${method} ${req.url}`);
        break;
      } else {
        this.stack[0].handleRequest(req, res, null);
        break;
      }
    }
  }

  private route(path: string) {
    const route = new Route(path);
    const layer = new Layer(
      path,
      (req: IncomingMessage, res: ServerResponse, params: any) => {
        route.dispatch(req, res, params);
      }
    );
    layer.route = route;
    this.stack.push(layer);
    return route;
  }

  public get(path: string, callback: Function) {
    const route = this.route(path);
    route.get(callback);
    return this;
  }

  public post(path: string, callback: Function) {
    const route = this.route(path);
    route.post(callback);
    return this;
  }
}
