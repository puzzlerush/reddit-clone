const express = require('express')
const usersRouter = require('./routers/users')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})