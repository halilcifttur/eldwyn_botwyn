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
  if (message.toLowerCase() === '!ölüm')
  {
    fs.readFile('./src/counter.txt', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      client.say(channel, data);
      return;
    });
  }

  // Sayaç Artırma:
  if (message.toLowerCase() === '!öldü')
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

          client.say(channel, `${counter} oldu yok mu artıran KEKW`);
          return;
        });
      });
    }
  }

  // Yetki:
  if (message.toLowerCase().includes('!yetki'))
  {
    const user = message.substring(7);
    const lowerCase = message.substring(7).toLowerCase();

    const allowedUsers = fs.readFileSync('./src/whitelist.txt', 'utf-8').split(',');

    const isWriterExist = (allowedUsers.indexOf(tags.username) > -1);
    const isUserExist = (allowedUsers.indexOf(lowerCase) > -1);
    if (isWriterExist)
    {
      if (lowerCase.length === 0)
      {
        client.say(channel, '!yetkiden sonra isim yazmalısın');
        return;
      }

      if (!isUserExist)
      {
        allowedUsers.push(lowerCase);
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
});
