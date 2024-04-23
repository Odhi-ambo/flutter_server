const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
  host: process.env.HOST_NAME,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = mysqlPool;