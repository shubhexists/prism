import { Route } from "./route";

export interface MatchResult {
  matched: boolean;
  params?: { [key: string]: string };
}

export class Layer {
  private handler: Function;
  private path: String;
  public method: String | null = null;
  public route: Route | undefined;
  constructor(path: string, handler: Function) {
    this.handler = handler;
    this.path = path;
  }

  public handleRequest(...args: any) {
    const handler = this.handler;
    handler ? handler(...args) : null;
  }

  public matchPath(path: string): MatchResult {
    const setupPath = this.path.split("/");
    const currentPath = path.split("/");
    
    let match = true;
    let params: { [key: string]: string } = {};
    for (let i = 0; i < setupPath.length; i++) {
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
}
