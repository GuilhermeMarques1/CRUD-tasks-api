import http from "node:http";
import { formatRequest } from "./middlewares/format-request.js";
import { routes } from "./routes.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await formatRequest(req, res);
  
  const route = routes.find(route => {
    return route.method === method && route.path === url;
  });

  if(route) {
    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
