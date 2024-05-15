import { Database } from "./services/db.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    }
  },

  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      
      if(!title || !description) {
        return res.writeHead(400).end("It's missing data");
      } 

      database.insert("tasks", {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toString(),
        completed_at: null,
        updated_at: null,
      });

      return res.writeHead(201).end();
    }
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const id = req.params.id;

      if(!id) {
        return res.writeHead(400).end();
      }

      const body = {...req.body};

      Object.keys(body).forEach((prop) => {
        if(prop !== "title" && prop !== "description") {
          return res.writeHead(400).end(`Property ${prop} is not known`);
        }
      })

      if(!body.hasOwnProperty("title") && !body.hasOwnProperty("description")) {
        return res.writeHead(400).end();
      }

      body.updated_at = new Date().toString();

      const updated = database.update("tasks", id, body);

      if(updated) {
        return res.writeHead(200).end(`Task ${id} succesfuly updated`);
      }

      return res.writeHead(404).end(`Task ${id} not  found`);
    }
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const id = req.params.id;

      if(!id) {
        return res.writeHead(400).end();
      }

      const deleted = database.delete("tasks", id);

      if(deleted) {
        return res.writeHead(200).end(`Task ${id} succesfuly deleted`);
      }

      return res.writeHead(404).end(`Task ${id} not found`);
    }
  }
]
