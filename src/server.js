import http from "node:http";
import { formatRequest } from "./middlewares/format-request.js";
import { routes } from "./routes.js";
import { extractQueryParameters } from "./utils/extract-query-parameters.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await formatRequest(req, res);
  
  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  });

  if(route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParameters(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
