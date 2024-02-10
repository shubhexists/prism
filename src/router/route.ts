import { Layer } from "./layer";

export class Route {
  private path: string;
  private stack: Array<Layer>;
  private method: any;
  constructor(path: string) {
    this.path = path;
    this.stack = [];
    this.method = {};
  }

  public routeHandler(method: string) {
    const name = method.toLowerCase();
    return Boolean(this.method[name]);
  }

  public get(callback: Function) {
    const layer = new Layer("/", callback);
    layer.method = "get";
    this.method["get"] = true;
    this.stack.push(layer);
    return this;
  }

  public post(callback: Function) {
    const layer = new Layer("/", callback);
    layer.method = "post";
    this.method["post"] = true;
    this.stack.push(layer);
    return this;
  }

  public dispatch(req: any, res: any) {
    const method = req.method.toLowerCase();
    this.stack.forEach((layer) => {
      if (layer.method === method) {
        layer.handleRequest(req, res);
      }
    });
  }
}
