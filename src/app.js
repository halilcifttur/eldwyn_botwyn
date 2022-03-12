import fs from 'fs'
import tmi from 'tmi.js'
import { BOT_USERNAME, OAUTH_TOKEN, CHANNEL_NAME } from './constants';

const options = {
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: [CHANNEL_NAME]
}

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {

  if (self) return;

  // Sayaç:
  else if (message.toLowerCase() === '!ölüm')
  {
    fs.readFile('./src/counter.txt', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      fs.readFile('./src/countermage.txt', 'utf-8', (err, dataMage) => {
        if (err) {
          console.error(err);
          return;
        }
        client.say(channel, `Mage Ölüm: ${dataMage} - Toplam Ölüm: ${data}`);
        return;
      });
    });
  }

  // Sayaç Artırma:
  else if (message.toLowerCase() === '!öldü')
  {
    const allowedUsers = fs.readFileSync('./src/whitelist.txt', 'utf-8').split(',');
    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    if (isWriterExist)
    {
      fs.readFile('./src/counter.txt', 'utf-8', (err, data) => {
        if (err)
        {
          console.error(err);
          return;
        }

        const counter = parseInt(data) + 1;
        fs.writeFile('./src/counter.txt', `${counter}`, err => {
          if (err)
          {
            console.error(err);
            return;
          }

          fs.readFile('./src/countermage.txt', 'utf-8', (err, datamage) => {
            if (err)
            {
              console.error(err);
              return;
            }

            const counterMage = parseInt(datamage) + 1;
            fs.writeFile('./src/countermage.txt', `${counterMage}`, err => {
              if (err)
              {
                console.error(err);
                return;
              }

              const sentences = fs.readFileSync('./src/sentence.txt', 'utf-8').split(',');
              const randomSentence = Math.floor(Math.random() * sentences.length);
              client.say(channel, `Mage Ölüm: ${counterMage} - Toplam Ölüm: ${counter} ${sentences[randomSentence]}`);
              return;
            });
          });
        });
      });
    }
  }

  // Sayaç Eksiltme:
  else if (message.toLowerCase() === '!ölmedi')
  {
    const allowedUsers = fs.readFileSync('./src/whitelist.txt', 'utf-8').split(',');
    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    if (isWriterExist)
    {
      fs.readFile('./src/counter.txt', 'utf-8', (err, data) => {
        if (err)
        {
          console.error(err);
          return;
        }

        const counter = parseInt(data) - 1;
        fs.writeFile('./src/counter.txt', `${counter}`, err => {
          if (err)
          {
            console.error(err);
            return;
          }

          fs.readFile('./src/countermage.txt', 'utf-8', (err, datamage) => {
            if (err)
            {
              console.error(err);
              return;
            }

            const counterMage = parseInt(datamage) - 1;
            fs.writeFile('./src/countermage.txt', `${counterMage}`, err => {
              if (err)
              {
                console.error(err);
                return;
              }

              client.say(channel, `Mage Ölüm: ${counterMage} - Toplam Ölüm: ${counter} ama bu hile !!!`);
              return;
            });
          });
        });
      });
    }
  }

  // Yetki:
  else if (message.toLowerCase().includes('!yetki'))
  {
    if (!message.includes('@')) {
      return;
    }

    const user = message.split('@')[1];
    const allowedUsers = fs.readFileSync('./src/whitelist.txt', 'utf-8').split(',');

    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    const isUserExist = (allowedUsers.indexOf(user.toLowerCase()) > -1);
    if (isWriterExist)
    {
      if (!isUserExist)
      {
        allowedUsers.push(user.toLowerCase());
        allowedUsers.forEach(element => {
          fs.writeFile('./src/whitelist.txt', `${allowedUsers}`, err => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
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

  // Açıklama Ekleme:
  else if (message.toLowerCase().includes('!ekle'))
  {

    if (!message.includes('#')) {
      return;
    }
    if (message.includes(',')) {
      client.say(channel, 'Açıklama eklerken kelimeler arasında virgül kullanmayın.');
      return;
    }

    const sentence = message.split('#')[1];

    const allowedUsers = fs.readFileSync('./src/whitelist.txt', 'utf-8').split(',');
    const sentences = fs.readFileSync('./src/sentence.txt', 'utf-8').split(',');

    const tempSentences = [];
    sentences.forEach(element => {
      tempSentences.push(element.toLowerCase());
    });
    const isSentenceExist = (tempSentences.indexOf(sentence.toLowerCase()) > -1);
    if (isSentenceExist) {
      client.say(channel, 'Bu açıklama daha önce eklenmiş.');
      return;
    }

    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    if (isWriterExist)
    {
      sentences.push(sentence);
      sentences.forEach(element => {
        fs.writeFile('./src/sentence.txt', `${sentences}`, err => {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
      client.say(channel, `${tags.username} isteğini ekledim.`);
      return;
    }
  }

  // Yardım Komutu:
  else if (message.toLowerCase() === '!yardım')
  {
    client.say(channel, 'Komutlar: Ölüm Sayacı için !ölüm - Sayaca bir eklemek için: !öldü - Sayaçtan bir çıkarmak için: !ölmedi - Yetki vermek için: !yetki @[kullanıcı adı] - Yeni ölüm açıklaması eklemek için: !ekle #[açıklama] yazabilirsiniz.');
  }
});
