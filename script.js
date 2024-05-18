import fs from "node:fs";
const path = new URL("./tasks.csv", import.meta.url);
const totalLines = 10000;

// Create a write stream
const writeStream = fs.createWriteStream(path);

// Write the header
writeStream.write('title,description\n');

// Generate and write the lines
for (let i = 1; i <= totalLines; i++) {
  writeStream.write(`task ${i},lorem ipsum task ${i}\n`);
}

// End the write stream
writeStream.end(() => {
  console.log('CSV file has been created.');
});
