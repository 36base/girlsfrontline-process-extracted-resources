
const lineStrParse = (lineStr) => {
  
  let result = { };

  const speakerStr = lineStr.substring(0, lineStr.indexOf('||'));

  const separator = lineStr.indexOf('：') !== -1 ? '：' : ':';

  const mediaStr = lineStr.substring(lineStr.indexOf('||') + 2, lineStr.indexOf(separator)); // not ':', '：' right
  const textStr = lineStr.substring(lineStr.indexOf(separator) + 1, lineStr.length);


  const getInnerStrByTagNameFromStr = (str, tag) => {
    const openTag = `<${tag}>`, closeTag = `</${tag}>`;
    return (str.indexOf(openTag) !== -1 && str.indexOf(closeTag) !== -1) ? str.substring(str.indexOf(openTag) + openTag.length, str.indexOf(closeTag)) : '';
  }
  
  if (mediaStr.trim() !== '') {
    const backgroundImage = getInnerStrByTagNameFromStr(mediaStr, 'BIN');

    if (backgroundImage) {
      const background = { id: Number(backgroundImage) };
      
      if (mediaStr.indexOf('<Night>') !== -1) { background.isNight = true; }

      result.background = background;
    }

    const frame = getInnerStrByTagNameFromStr(mediaStr, '边框');
    if (frame) { result.frame = Number(frame); }

    let screenEffect = "";
    {
      if (mediaStr.indexOf('睁眼') !== -1) { screenEffect = "blink"; }
      if (mediaStr.indexOf('黑屏1') !== -1) { screenEffect = "dark1"; }
      if (mediaStr.indexOf('黑屏2') !== -1) { screenEffect = "dark2"; }
      if (mediaStr.indexOf('白屏1') !== -1) { screenEffect = "white1"; }
      if (mediaStr.indexOf('白屏2') !== -1) { screenEffect = "white2"; }
      if (mediaStr.indexOf('黑点1') !== -1) { screenEffect = "blackSpot1"; }
      if (mediaStr.indexOf('黑点2') !== -1) { screenEffect = "blackSpot2"; }
      if (mediaStr.indexOf('刮花') !== -1) { screenEffect = "scratching"; }
      if (mediaStr.indexOf('火花') !== -1) { screenEffect = "spark"; }
      if (mediaStr.indexOf('关闭火花') !== -1) { screenEffect = "closeSpark"; }
      if (mediaStr.indexOf('震屏') !== -1) { screenEffect = "shockScreen"; }

      if (screenEffect) { result.screenEffect = screenEffect; }
    }
    const spot = getInnerStrByTagNameFromStr(mediaStr, '分支');;
    if (spot) result.spot = spot;

    const sound = { };
    {
      const bgm = getInnerStrByTagNameFromStr(mediaStr, 'BGM');
      if (bgm) { sound.bgm = bgm; }
    
      const se1 = getInnerStrByTagNameFromStr(mediaStr, 'SE1');
      if (se1) { sound.se1 = se1; }
    
      const se2 = getInnerStrByTagNameFromStr(mediaStr, 'SE2');
      if (se2) { sound.se2 = se2; }

      if (JSON.stringify(sound) !== "{}") { result.sound = sound; }
    }
  }

  if (speakerStr.trim() !== '()') {
    const speakers = speakerStr.split(';');

    const speaker = { };

    const characters = speakers.map((iter, i) => {
      let result = { name: iter.substring(0, iter.indexOf('(')) };
      
      const face = iter.substring(iter.indexOf('(') + 1, iter.indexOf(')'));
      if (face) { result.face = Number(face); }

      if (iter.indexOf('Speaker') !== -1) {
        speaker.index = i;

        const speakerName = getInnerStrByTagNameFromStr(iter, 'Speaker');
        if (speakerName) { speaker.name = speakerName; }
      }
      
      if (iter.indexOf('通讯框') !== -1) { result.inCommunicationBox = true; }

      return result;
    });
    result.characters = characters;
    if (JSON.stringify(speaker) !== "{}") { result.speaker = speaker; }
  }

  if (textStr.trim() !== '') { result.text = textStr.trim();}

  return result;
}

const textData = require('./../../temp/textData.json');

const itemParse = (str) => {

  let splits = str.split('\n');
  splits = splits.slice(0, splits.length - 1);

  const result = splits.map(iter => {
    const lineResult = lineStrParse(iter);

    if (lineResult.text && Number(lineResult.text)) {
      lineResult.text = textData[lineResult.text];
    }
    return lineResult;
  });

  return result;
}

module.exports = itemParse;