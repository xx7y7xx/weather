const fs = require('fs');

const filename = 'credentials.json';

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file ${filename}:`, err);
    return;
  }
  console.log(`Content of ${filename}:`);
  console.log(data.replace(",", ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"));
});