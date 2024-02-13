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
      //   console.log(middleware);
    } else {
      middleware.push(middlewar as MiddleWareValues);
      //   console.log(middleware);
    }
  }

  function matchPath(path: string, setup_path: string) {
    const setupPath = setup_path.split("/");
    const currentPath = path.split("/");
    let match = true;
    // console.log("setupPath - ", setupPath);
    // console.log("currentPath - ", currentPath);
    let params: { [key: string]: string } = {};
    for (let i = 1; i < setupPath.length; i++) {
      var route = setupPath[i];
      //   console.log("Route - ", route);
      var path_ = currentPath[i];
      //   console.log("path_ - ", path_);
      if (route.charAt(0) === ":") {
        params[route.substr(1)] = path_;
        // console.log("matched");
      } else if (route === "*") {
        // console.log("matched");
        break;
      } else if (route !== path_) {
        // console.log("not matched");
        match = false;
        break;
      }
    }
    // console.log({ matched: match, params: match ? params : undefined });
    return match ? { matched: true, params } : { matched: false };
  }

  function findNext(req: CustomRequest, res: CustomResponse) {
    let current = -1;
    const next = () => {
      current += 1;
      const middlewar = middleware[current];
      const { matched = false, params = {} } = middlewar
        ? matchPath((req as any).url, middlewar.path)
        : {};
      //   console.log(matched);
      // console.log(current, middleware.length - 1);
      if (matched && current <= middleware.length - 1) {
        // console.log("here");
        (req as any).params = params;
        middlewar.callbackFunction(req, res, next);
      } else if (current < middleware.length - 1) {
        next();
      } else {
        // console.log(":/ ");
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
        handle(req as CustomRequest, res as CustomResponse, () => {
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
