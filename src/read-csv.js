import fs from "node:fs";
import { parse } from "csv-parse";

async function readCsv() {
  const filePath = new URL("../tasks.csv", import.meta.url);

  const readableStreamCsv = fs.createReadStream(filePath);

  const csv = readableStreamCsv.pipe(
    parse()
  );

  let index = 0;
  for await (const record of csv) {
    if(index > 0 ) {
      process.stdout.write(`${record.join(',')}\n`);
      const [title, description] = record;

      await fetch("http://localhost:3333/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description
        })
      }).then((res) => {
        console.log(res.status)
      })
    }
    index++;
  }
}

readCsv();
