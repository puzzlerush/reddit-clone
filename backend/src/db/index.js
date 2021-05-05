const { Pool } = require('pg')

const devConfig = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DBNAME,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
}

const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}

const pool = new Pool(process.env.NODE_ENV === 'production' ? prodConfig : devConfig)

module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
  }
}