require('dotenv').config();
require = require("esm")(module)
const server = require("./api/server");

server.listen(process.env.PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${process.env.PORT}`);
});

module.exports = require("./app.js")
