require('dotenv').config();
const dbEngine = process.env.DB_ENVIRONMENT || "test";
const config = require('./knexfile')[dbEngine];

module.exports = require('knex')(config);
