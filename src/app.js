import fs from 'fs'
import tmi from 'tmi.js'
import { BOT_USERNAME , OAUTH_TOKEN , CHANNEL_NAME , ALLOWED_USERS} from './constants';

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
	channels: [ CHANNEL_NAME ]
}

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {

	if(self) return;

  if (message.toLowerCase() === '!ölüm') {
    fs.readFile('./src/counter.txt', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      client.say(channel, data);
    });
  }

  if (message.toLowerCase() === '!öldü' && ALLOWED_USERS.some(allowedUser => tags.username.includes(allowedUser.toLowerCase()))) {
    fs.readFile('./src/counter.txt', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const counter = parseInt(data) + 1;
      fs.writeFile('./src/counter.txt', `${counter}`, err => {
        if (err) {
          console.error(err);
          return;
        }
        client.say(channel, `${counter} oldu yok mu artıran KEKW`);
      });
    });
  }
});
