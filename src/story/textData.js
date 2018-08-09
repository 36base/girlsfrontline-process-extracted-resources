
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Path For File : ', (answer) => {
  fs.readFile(answer, 'utf8', (err, data) => {
    const result = { };

    data.split('\n').forEach(iter => {
      const point = iter.indexOf('|');
      result[iter.substring(0, point)] = iter.substring(point + 1).trim();
    });

    fs.writeFile('./../../temp/textData.json', JSON.stringify(result), err => {
      if (err) { console.log(err); }
    });
  });

  rl.close();
});