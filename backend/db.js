console.log("DB Module Loaded")

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: "infinite-justice-db.cy3kqs4845b9.us-east-1.rds.amazonaws.com",
  port: 5432,
  database: "infinitejustice",
  user: "postgres",
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;