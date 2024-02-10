import * as http from "http";
import { Router } from "./router";
import { CustomResponse, response } from "./reponse";
import { request } from "./request";

interface MiddleWareValues {
  path: string;
  callbackFunction: (
    req: http.IncomingMessage,
    res: CustomResponse,
    next: () => void
  ) => void;
}

interface CustomRequest extends http.IncomingMessage {
  handler: (req: CustomRequest, res: CustomResponse) => any;
}

interface ListenInterface {
  port: number;
  callback: Function;
}

export function Prism() {
  const middleware: Array<MiddleWareValues> = [];
  const router = new Router();

  function use(middlewar: MiddleWareValues | Function): void {
    if (typeof middlewar == "function") {
      middleware.push({
        path: "*",
        callbackFunction: middlewar,
      } as MiddleWareValues);
    } else {
      middleware.push(middlewar as MiddleWareValues);
    }
  }

  function matchPath(path: string, setup_path: string) {
    const setupPath = setup_path.split("/");
    const currentPath = path.split("/");
    let match = true;
    let params: { [key: string]: string } = {};
    for (let i = 0; i < setup_path.length; i++) {
      var route = setupPath[i];
      var path = currentPath[i];
      if (route[0] === ":") {
        params[route.substr(1)] = path;
      } else if (route === "*") {
        break;
      } else if (route !== path) {
        match = false;
        break;
      }
    }
    return { matched: match, params: match ? params : undefined };
  }

  function findNext(req: CustomRequest, res: CustomResponse): () => void {
    let current = -1;

    const next = () => {
      current += 1;
      const middlewar = middleware[current];
      const { matched = false, params = {} } = middlewar
        ? matchPath(middlewar.path, req.url || "")
        : {};

      if (matched) {
        (req as any).params = params;
        middlewar.callbackFunction(req, res, next);
      } else if (current < middleware.length) {
        next();
      } else {
        req.handler(req, res);
      }
    };

    return next;
  }

  function handle(
    req: CustomRequest,
    res: CustomResponse,
    cb: () => any
  ): void {
    const next = findNext(req, res);
    req.handler = cb;
    next();
  }

  function get({ path, callbackFunction }: MiddleWareValues) {
    return router.get(path, callbackFunction);
  }

  function post({ path, callbackFunction }: MiddleWareValues) {
    return router.post(path, callbackFunction);
  }

  function listen({ port, callback }: ListenInterface) {
    return http
      .createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
        response(res as CustomResponse);
        request(req);
        handle(req as CustomRequest, res as CustomResponse, () =>
          router.handle(req, res)
        );
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
