const readline = require('readline');
const fs = require('fs');

const itemParse = require('./itemParse');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Path For Data Directory : ', (answer) => {
  
  fs.readdir(answer, (err, files) => {
    files.forEach(iter => {
      fs.readFile(`${answer}/${iter}`, 'utf8', (err, data) => {
        if (data) {
          fs.writeFile(`./../../output/${iter.substring(0, iter.indexOf('.txt'))}.json`, JSON.stringify(itemParse(data), null, 2), err => {
            if (err) { console.log(err); }
          });
        }
      });
    });
  });

  rl.close();
});