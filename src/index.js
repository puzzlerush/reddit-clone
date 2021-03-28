const express = require('express')
const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')
const subredditsRouter = require('./routers/subreddits')
const moderatorsRouter = require('./routers/moderators')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/subreddits', subredditsRouter)
app.use('/moderators', moderatorsRouter)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})