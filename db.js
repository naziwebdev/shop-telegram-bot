const mysql = require("mysql2/promise");
const configs = require("./configs");

const access = {
  uri: configs.db.uri,
  connentionLimit: configs.db.poolSize,
  waitForConnections: true,
};

const connection = mysql.createPool(access);

module.exports = connection;
