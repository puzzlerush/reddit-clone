const express = require('express')
const { query } = require('./db')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  const results = await query('select * from users')
  console.log(results)
  res.send(results)
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})