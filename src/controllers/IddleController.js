import Redux, { ACTION_CREATOR } from '../models/ReduxWrapper';
import { STATE_ID } from '../constants';
import Line from '../utils/LineWrapper';
import _ from 'lodash';

const iddleController = event => {
  const sourceId = Line.getSourceId(event);
  const message = Line.getTextMessage(event).toLowerCase().trim();
  const currentState = Redux.getState(sourceId);
  
  if (message.match(/^start$/)) {
    // Generate Secret Code
    const secretNum = getNDigitUniqueRandom(4);

    const nextState = {
      ...currentState,
      secretNum,
      stateId: STATE_ID.IN_GAME,
      trialCount: 0,
    };

    Redux.dispatch(ACTION_CREATOR.set(sourceId, nextState));

    let reply_1 = 'Joker telah memasang bom di kota Gotham.\nBantu batman untuk menjinakan bom Joker !\n\n';
    reply_1 = reply_1 + 'Untuk menjinakan bom itu, kamu harus memasukan sandi yang tepat.\n';
    reply_1 = reply_1 + 'Sandi terdiri dari 4 angka.\nKamu hanya memiliki 12 kali kesempatan atau waktu 30 menit untuk menebak sandinya.\n\n';
    reply_1 = reply_1 + 'Pecahkan sandinya !\nPerdamaian dunia ada di tanganmu !\n ketik `help` jika masih bingung';
    let reply_2 = 'https://media.giphy.com/media/AwoDg0wJImOjK/giphy-downsized.gif';
    let replies = [
      Line.textMessage(reply_1),
      Line.imageMessage(reply_2),
    ];
    Line.replyLineMessage(event, replies);
    return true;
  }

  if (message.match(/^help$/)) {

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
    Line.replyLineMessage(event, replies);
    return true;
  }

  return null;
}

/**
 * Helper functions
 */
const getNDigitUniqueRandom = (width) => {
  const randSet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return shuffleArray(randSet).splice(0, width).join('');
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

export default iddleController;
