require('dotenv').config();
import tmi from 'tmi.js'
import db from '../../dbHelpers'
const express = require("express");
const server = express();

server.use(express.json());
const client = require("../app");

// API ile Ölüm Sayacı Artırma:
server.get('/dead', async (req, res) => {
  const counter = await db.getCounter();
  const id = counter[0];
  const total = counter[1];
  const mage = counter[2];

  await db.updateCounter(id, total + 1, mage + 1);

  const sentences = await db.getDescription();
  const randomSentence = Math.floor(Math.random() * sentences.length);
  client.say(process.env.CHANNEL_NAME, `Mage Ölüm: ${mage + 1} - Toplam Ölüm: ${total + 1} ${sentences[randomSentence]}`);
})

// API ile Ölüm Sayacı Eksiltme:
server.get('/notdead', async (req, res) => {
  const counter = await db.getCounter();
  const id = counter[0];
  const total = counter[1];
  const mage = counter[2];

  await db.updateCounter(id, total - 1, mage - 1);

  client.say(process.env.CHANNEL_NAME, `Mage Ölüm: ${mage - 1} - Toplam Ölüm: ${total - 1} ama bu hile !!!`);
})

module.exports = server;
