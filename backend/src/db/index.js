const { Pool } = require('pg')

const config = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DBNAME,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
}

const pool = new Pool(config)

module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
  }
}