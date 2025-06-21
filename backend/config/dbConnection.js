const mysql2 = require("mysql2");
const dotenv = require("dotenv").config();

//database connection
const db = mysql2.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
});
console.log(`Connected to database: ${process.env.MYSQL_DATABASE}`);
module.exports = { db };
