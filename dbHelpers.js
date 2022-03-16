import db from './dbConfig'

export default {
  addWhitelist,
  getWhitelist,
  addDescription,
  getDescription,
  addCounter,
  updateCounter,
  getCounter
};

async function addWhitelist(name) {
  await db('whitelist').insert({ name: `${name}` });
}

async function getWhitelist() {

  var result = [];

  await db('whitelist').select('name').then(whitelist => {
    for (var i in whitelist) {
        result.push(whitelist[i].name);
    }
  })
  .catch(error => {
    console.log(error)
  });;

  return result;
}

async function addDescription(text) {
  await db("description").insert({ text: `${text}` });
}

async function getDescription() {

  var result = [];

  await db('description').select('text').then(description => {
    for (var i in description) {
        result.push(description[i].text);
    }
  })
  .catch(error => {
    console.log(error)
  });;

  return result;
}

async function addCounter() {
  await db("counter").insert({ total: 0, mage: 0});
}

async function updateCounter(id, total, mage) {
  await db("counter").where({ id }).update({ total: total, mage: mage });
}

async function getCounter() {

  var result = [];

  await db('counter').then(counter => {
    for (var i in counter) {
        result.push(counter[i].id);
        result.push(counter[i].total);
        result.push(counter[i].mage);
    }
  })
  .catch(error => {
    console.log(error)
  });;

  return result;
}
