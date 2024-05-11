import { Database } from "./services/db.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    }
  },

  {
    method: "POST",
    path: "/tasks",
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
  }
]
