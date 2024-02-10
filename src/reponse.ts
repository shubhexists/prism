import { ServerResponse } from "http";

export interface CustomResponse extends ServerResponse {
  status: (code: number) => CustomResponse;
  send: (content: string) => CustomResponse;
  json: (content: any) => CustomResponse;
  redirect: (url: string) => CustomResponse;
}

export function response(res: CustomResponse) {
  function end(content: string): CustomResponse {
    res.setHeader("Content-Length", content.length);
    res.status(res.statusCode);
    res.end(content);
    return res;
  }

  res.status = (code: number): CustomResponse => {
    res.statusCode = code;
    return res;
  };

  res.send = (content: string): CustomResponse => {
    res.setHeader("Content-Type", "text/html");
    return end(content);
  };

  res.json = (content: any): CustomResponse => {
    try {
      content = JSON.stringify(content);
    } catch (err) {
      throw err;
    }
    res.setHeader("Content-Type", "application/json");
    return end(content);
  };

  res.redirect = (url: string): CustomResponse => {
    res.setHeader("Location", url);
    res.status(301);
    res.end();
    return res;
  };
}
