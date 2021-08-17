const express = require('express')
const { query } = require('../db')
const auth = require('../middleware/auth')()

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const selectSubredditsStatement = `select * from subreddits`
    const { rows } = await query(selectSubredditsStatement)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params
    const selectSubredditStatement = `select * from subreddits where name = $1`
    const {
      rows: [subreddit],
    } = await query(selectSubredditStatement, [name])

    if (!subreddit) {
      res.status(404).send({ error: 'Could not find subreddit with that name' })
    }

    res.send(subreddit)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body

    const nameRegex = new RegExp('^[a-z0-9]+$', 'i')

    if (!nameRegex.test(name)) {
      throw new Error(
        'Subreddit name must consist only of alphanumeric characters, and must have length at least 1'
      )
    }

    const insertSubredditStatement = `
      insert into subreddits(name, description)
      values($1, $2)
      returning *
    `

    let subreddit
    try {
      ;({
        rows: [subreddit],
      } = await query(insertSubredditStatement, [name, description]))
    } catch (e) {
      res
        .status(409)
        .send({ error: 'A subreddit with that name already exists' })
    }

    const insertModeratorStatement = `
      insert into moderators(user_id, subreddit_id)
      values($1, $2)
    `

    await query(insertModeratorStatement, [req.user.id, subreddit.id])

    res.send(subreddit)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
