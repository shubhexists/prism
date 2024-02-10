import { IncomingMessage } from "http";
import { UrlWithParsedQuery } from "url";
import * as url from "url";

export function request(req: IncomingMessage): void {
  const parsedUrl: UrlWithParsedQuery = url.parse(
    `${req.headers.host}${req.url}`,
    true
  );

  const reqWithUrl: { [key: symbol | string | number]: any } = req;

  Object.keys(parsedUrl).forEach((key: string) => {
    if (key in parsedUrl && key in reqWithUrl) {
      reqWithUrl[key] = (parsedUrl as any)[key];
    }
  });
}
