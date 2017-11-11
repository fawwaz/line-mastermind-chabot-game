import Redux, { ACTION_CREATOR } from '../models/ReduxWrapper';
import { STATE_ID } from '../constants';
import Line from '../utils/LineWrapper';
import {
  howManyCorrectNumbers,
  howManyCorrectSpots,
} from '../utils/Algorithm';

const inGameController = event => {

  const sourceId = Line.getSourceId(event);
  const message = Line.getTextMessage(event).toLowerCase().trim();
  const currentState = Redux.getState(sourceId);
  
  if (message.match(/^help$/g)) {

    let reply_1 = 'Di setiap kesempatan, kamu akan diberi 2 buah petunjuk. \n 1. Jumlah angka yang benar. \n 2. Jumlah angka yang posisinya benar.';
    let reply_2 = 'Agar lebih paham, perhatikan contoh berikut :\n';
    reply_2 = reply_2 + 'Misalkan sandi bomnya adalah 1234\n';
    reply_2 = reply_2 + '------\n';
    reply_2 = reply_2 + 'Lalu kamu menebak sandinya dengan angka `1293`';
    reply_2 = reply_2 + 'Bot akan merespon :\n\n';
    reply_2 = reply_2 + '1. Jumlah angka yang benar : 3\n';
    reply_2 = reply_2 + '2. Jumlah angka yang posisinya benar : 2';
    let reply_3 = 'Pembahasan : \nAngka yang kamu tebak (1293) memiliki 3 angka yang sama (angka 1, 2 dan 3) dengan angka rahasia Joker (1234).\n\nHanya saja baru ada 2 angka yang posisinya sudah tepat yaitu angka 1 dan 2.';
    let reply_4 = 'Dengan bantuan informasi ini, coba pecahkan sandinya !';
    const sticker_id = 138;
    const package_id = 1;
    const replies = [
      Line.textMessage(reply_1),
      Line.textMessage(reply_2),
      Line.textMessage(reply_3),
      Line.textMessage(reply_4),
      Line.stickerMessage(sticker_id, package_id),
    ];
    return Line.replyLineMessage(event, replies);
  }

  if (message.match(/^cancel$/g)) {
    let reply = 'Joker menyerah, misi dibatalkan. Mulai lagi misi dengan perintah `start`';
    Redux.dispatch(ACTION_CREATOR.reset(sourceId));
    return Line.replyLineMessage(event, Line.textMessage(reply));
  }

  if (!message.match(/^[0-9]{4}$/g)) {
    let reply = 'Maaf kamu hanya boleh memasukan 4 digit angka';
    return Line.replyLineMessage(event, Line.textMessage(reply));
  }

  if (message.match(/^[0-9]{4}$/g)) {
    const currentTrialCount = Redux.getTrialCount(sourceId);
    const secretNum = Redux.getSecretNumber(sourceId);

    if (currentTrialCount < 12) {
      const correctNum = howManyCorrectNumbers(secretNum, message);
      const correctSpot = howManyCorrectSpots(secretNum, message);

      if (correctSpot === 4) {
        Redux.dispatch(ACTION_CREATOR.reset(sourceId));

        let reply_1 = 'Fyuh.. syukurlah, kamu berhasil menjinakan bom joker. Kota gotham berhutang kepadamu ! \n\n Mulai lagi permainan dengan ketik `start`';
        let replies = [
          Line.textMessage(reply_1),
        ];
        return Line.replyLineMessage(event, replies);
      }

      const nextState = {
        ...currentState,
        trialCount: currentTrialCount + 1,
      };
      Redux.dispatch(ACTION_CREATOR.set(sourceId, nextState));

      let reply = 'Ups, tebakanmu salah, ada \n';
      reply = reply + `1. Jumlah angka yang benar : ${correctNum}\n`;
      reply = reply + `2. Jumlah angka yang posisinya benar : ${correctSpot}\n`;
      reply = reply + `Sisa kesempatanmu tinggal : ${11-currentTrialCount}`;
      
      return Line.replyLineMessage(event, Line.textMessage(reply));
    } else {
      Redux.dispatch(ACTION_CREATOR.reset(sourceId));
      
      let reply_1 = 'DUARR... kota gotham hancur berkeping keping. Kamu gagal menebak sandi bom joker.';
      reply_1 = reply_1 + ' Sandi yang benar adalah :' + secretNum;
      let reply_2 = 'https://upload.wikimedia.org/wikipedia/commons/7/79/Operation_Upshot-Knothole_-_Badger_001.jpg';
      const replies = [
        Line.textMessage(reply_1),
        Line.imageMessage(reply_2),
      ];
      return Line.replyLineMessage(event, replies);
    }
  }

  return null;
}

export default inGameController;
