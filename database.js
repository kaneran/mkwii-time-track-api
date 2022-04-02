const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "rootuser",
  database: "mkwii-time-tracker",
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

module.exports = pool;
