require("dotenv").config();
const { Client } = require("pg");
const client = require("./services/openai");

async function main() {
  const client = new Client({
    host: "infinite-justice-db.cy3kqs4845b9.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "infinitejustice",
    user: "postgres",
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const res = await client.query("SELECT version()");
    console.log("Connected:", res.rows[0].version);
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

main();

module.exports = client;