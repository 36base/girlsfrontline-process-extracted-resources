const readline = require('readline');
const fs = require('fs');

const { dolls } = require('girlsfrontline-core');

const getDollData = (nameStr) => {
  let dollName = nameStr;
  let skin = 'default';

  if (nameStr.indexOf('_') !== -1) {
    const skinNum = Number(nameStr.substring(nameStr.lastIndexOf('_') + 1, nameStr.length));

    if (!isNaN(skinNum)) {
      skin = String(skinNum);
      dollName = nameStr.substring(0, nameStr.lastIndexOf('_'));
    }
  }
  const doll = dolls.find(({ name }) => name === dollName);

  if (!doll) {
    console.log(`Cannot found ${dollName}`);
    return { };
  }
  
  // 아동절 스킨
  if (skin === '0') {
    skin = Object.keys(doll.skins).find(item => {
      const skinGroupNum = parseInt(Number(item) / 100)
      return (skinGroupNum === 9 || skinGroupNum === 22);
    });
  }

  return {
    id: doll.id,
    skin,
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Path For File : ', (answer) => {

  fs.readFile(answer, 'utf8', (err, data) => {
    if (err) { return; }

    let result = { };

    let currentData = {
      name: '',
      doll: { },
    };
    data.split('\n').forEach(iter => {
      const splits = iter.split('|');
      
      if (currentData.name !== splits[0]) {
        const dollData = getDollData(splits[0]);

        if (JSON.stringify(dollData) === '{}') {
          return;
        }
        currentData.name = splits[0];
        currentData.doll = dollData;
      }

      const { doll } = currentData;
      
      if (!result[doll.id]) result[doll.id] = { };
      if (!result[doll.id][doll.skin]) result[doll.id][doll.skin] = { };

      const type = splits[1];
      const content = splits[2].substring(0, splits[2].length - 2); // remove '\r\r'

      result[doll.id][doll.skin][type] = content;
    });

    fs.writeFile(`./../../output/script.json`, JSON.stringify(result, null, 2), err => {
      if (err) { console.log(err); }
    });
    
  });

  rl.close();
});