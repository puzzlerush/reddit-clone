const express = require('express')
const { query } = require('../db')
const { selectModeratorsStatement, userIsModerator } = require('../db/utils')
const auth = require('../middleware/auth')()

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { username, subreddit } = req.query
    let whereClause = ''
    let whereClauseParams = []
    if (username && subreddit) {
      whereClause = 'where u.username = $1 and sr.name = $2'
      whereClauseParams = [username, subreddit]
    } else if (username) {
      whereClause = 'where u.username = $1'
      whereClauseParams = [username]
    } else if (subreddit) {
      whereClause = 'where sr.name = $1'
      whereClauseParams = [subreddit]
    }

    const getModeratorsStatement = `${selectModeratorsStatement} ${whereClause}`

    const { rows } = await query(getModeratorsStatement, whereClauseParams)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { username, subreddit } = req.body
    if (!username) {
      throw new Error('Must specify user')
    }
    if (!subreddit) {
      throw new Error('Must specify subreddit')
    }

    if (await userIsModerator(req.user.username, subreddit) === false) {
      return res.status(403).send({
        error: `You do not have permissions to add a moderator in the subreddit ${subreddit}`
      })
    }

    const insertModeratorStatement = `
      insert into moderators(user_id, subreddit_id)
      values(
        (select id from users where username = $1),
        (select id from subreddits where name = $2)
      ) returning *
    `

    const { rows: [insertedModerator] } = await query(insertModeratorStatement, [
      username,
      subreddit
    ])

    res.status(201).send(insertedModerator)

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.delete('/', auth, async (req, res) => {
  try {
    const { username, subreddit } = req.body
    if (!username) {
      throw new Error('Must specify user')
    }
    if (!subreddit) {
      throw new Error('Must specify subreddit')
    }

    if (await userIsModerator(req.user.username, subreddit) === false) {
      return res.status(403).send({
        error: `You do not have permissions to delete a moderator in the subreddit '${subreddit}'`
      })
    }

    const deleteModeratorStatement = `
      delete from moderators
      where user_id = (select id from users where username = $1)
      and subreddit_id = (select id from subreddits where name = $2)
      returning *
    `

    const { rows: [deletedModerator] } = await query(deleteModeratorStatement, [
      username,
      subreddit
    ])

    if (!deletedModerator) {
      return res.status(404).send({ error: 'Could not find that moderator' })
    }

    res.send(deletedModerator)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router