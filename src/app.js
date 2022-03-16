require('dotenv').config();
import tmi from 'tmi.js'
// import { BOT_USERNAME, OAUTH_TOKEN, CHANNEL_NAME } from './constants'
import db from '../dbHelpers'

const options = {
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL_NAME]
}

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', async (channel, tags, message, self) => { if (self) return; });

// Ölüm Sayacı:
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase() === '!ölüm')
  {
    const counter = await db.getCounter();
    const total = counter[1];
    const mage = counter[2];

    client.say(channel, `Mage Ölüm: ${mage} - Toplam Ölüm: ${total}`);
    return;
  }
});

// Ölüm Sayacı Artırma:
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase() === '!öldü')
  {
    const allowedUsers = await db.getWhitelist();
    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    if (isWriterExist || tags.username === 'elongef')
    {
      const counter = await db.getCounter();
      const id = counter[0];
      const total = counter[1];
      const mage = counter[2];

      await db.updateCounter(id, total + 1, mage + 1);

      const sentences = await db.getDescription();
      const randomSentence = Math.floor(Math.random() * sentences.length);
      client.say(channel, `Mage Ölüm: ${mage + 1} - Toplam Ölüm: ${total + 1} ${sentences[randomSentence]}`);
      return;
    }
  }
});

// Ölüm Sayıcı Eksiltme:
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase() === '!ölmedi')
  {
    const allowedUsers = await db.getWhitelist();
    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    if (isWriterExist || tags.username === 'elongef')
    {
      const counter = await db.getCounter();
      const id = counter[0];
      const total = counter[1];
      const mage = counter[2];

      await db.updateCounter(id, total - 1, mage - 1);

      client.say(channel, `Mage Ölüm: ${mage - 1} - Toplam Ölüm: ${total - 1} ama bu hile !!!`);
      return;
    }
  }
});

// Ölüm Sayacı için Yetki Verme:
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase().includes('!yetki'))
  {
    if (!message.includes('@'))
      return;

    const user = message.split('@')[1];
    const allowedUsers = await db.getWhitelist();

    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    const isUserExist = (allowedUsers.indexOf(user.toLowerCase()) > -1);
    if (isWriterExist || tags.username === 'elongef')
    {
      if (!isUserExist)
      {
        db.addWhitelist(user.toLowerCase())
        client.say(channel, `${user} yetkin verildi koçum`);
        return;
      }
      else
      {
        client.say(channel, `${user} senin zaten yetkin var`);
        return;
      }
    }
  }
});

// Ölüm Sayacı için Açıklama Ekleme:
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase().includes('!ekle'))
  {
    if (!message.includes('#'))
    {
      return;
    }

    const sentence = message.split('#')[1];
    const sentences = await db.getDescription();
    const tempSentences = [];

    sentences.forEach(element => {
      tempSentences.push(element.replace(/\s/g, '').toLowerCase());
    });
    const isSentenceExist = (tempSentences.indexOf(sentence.replace(/\s/g, '').toLowerCase()) > -1);
    if (isSentenceExist)
    {
      client.say(channel, 'Bu açıklama daha önce eklenmiş.');
      return;
    }

    const allowedUsers = await db.getWhitelist();

    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    if (isWriterExist || tags.username === 'elongef')
    {
      db.addDescription(sentence);
      client.say(channel, `${tags.username} isteğini ekledim.`);
      return;
    }
  }
});

// Yardım Menüsü:
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase() === '!yardım')
  {
    client.say(channel, 'Komutlar: Ölüm Sayacı için !ölüm - Sayaca bir eklemek için: !öldü - Sayaçtan bir çıkarmak için: !ölmedi - Yetki vermek için: !yetki @[kullanıcı adı] - Yeni ölüm açıklaması eklemek için: !ekle #[açıklama] yazabilirsiniz.');
    return;
  }
});

// İlk Kez Sayaça Ekleme (Yalnızca Tek Seferlik):
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase() === '!addcounter' && tags.username == 'elongef')
  {
    const counter = await db.getCounter();
    if (counter.length == 0)
    {
      db.addCounter()
      client.say(channel, 'Sayaç Eklendi');
      return;
    }
    else
    {
      client.say(channel, 'Sayaç zaten mevcut');
      return;
    }
  }
});

// Manuel Sayaç Güncelleme:
client.on('message', async (channel, tags, message, self) => {

  if (message.toLowerCase().includes('!updatecounter') && tags.username == 'elongef')
  {
    if (!message.includes('$'))
    {
      return;
    }

    const splittedMessage = message.split('$')[1];
    const total = parseInt(splittedMessage.split('-')[0]);
    const mage = parseInt(splittedMessage.split('-')[1]);

    const counter = await db.getCounter();
    const id = counter[0];
    db.updateCounter(id, total, mage);
    client.say(channel , `Ölüm Sayacı Mage Ölüm: ${mage} - Toplam Ölüm: ${total} olarak güncellendi.`)
    return;
  }
});
