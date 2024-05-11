import fs from "node:fs/promises";

const dbPath = new URL("../../database/db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(dbPath)
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist()
      });
  }

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
    return data;
  }

  select(table) {
    const data = this.#database[table] ?? [];

    return data;
  }
}
