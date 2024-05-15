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

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    console.log(this.#database[table][rowIndex]);
    // if(rowIndex > -1) {
    //   const updated = Object.create(this.#database[table][rowIndex]);
    //   Object.keys(updated).forEach(prop => {
    //     if(prop !== "id" && data[prop]) {
    //       updated[prop] = data[prop]
    //     }
    //   });

    //   this.#database[table][rowIndex] = updated;
    //   this.#persist();
    //   return true;
    // }

    // return false;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if(rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
      return true;
    }

    return false;
  }
}
