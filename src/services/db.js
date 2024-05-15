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

    if(rowIndex > -1) {
      const updatedRow = Object.entries(this.#database[table][rowIndex])
        .reduce((updatedObj, [key, value]) => {
          if(data[key]) {
            updatedObj[key] = data[key];
            return updatedObj;
          } else {
            updatedObj[key] = value;
            return updatedObj;
          }
        }, {})

      this.#database[table][rowIndex] = updatedRow
      this.#persist();
      return true;
    }

    return false;
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
