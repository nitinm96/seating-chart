const mysql2 = require("mysql2");
const dotenv = require("dotenv").config();

//database connection
const db = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
console.log(`Connected to database: ${process.env.DATABASE}`);
module.exports = { db };
