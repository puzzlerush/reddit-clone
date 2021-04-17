const express = require('express')
const { query } = require('../db')
const auth = require('../middleware/auth')()

const router = express.Router()

const checkVoteValid = async (post_id, vote_value) => {
  let status
  let error
  if (!/^\d+$/.test(post_id)) {
    status = 400
    error = 'Invalid post id'
  } else if (![-1, 0, 1].includes(parseInt(vote_value))) {
    status = 400
    error = 'Invalid vote value'
  } else {
    const { rows: [post] } = await query('select * from posts where id = $1', [post_id])
    if (!post) {
      status = 404
      error = 'Could not find post with that id'
    }
  }

  return { status, error }
}

router.get('/', async (req, res) => {
  try {
    const selectPostVotes = `select * from post_votes`
    const { rows } = await query(selectPostVotes)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { post_id, vote_value } = req.body

    const { status, error } = await checkVoteValid(post_id, vote_value)
    if (error) {
      return res.status(status).send({ error })
    }

    const insertPostVoteStatement = `
      insert into post_votes
      values($1, $2, $3) returning *
    `
    let post_vote
    try {
      const { rows: [vote] } = await query(insertPostVoteStatement, [
        req.user.id,
        post_id,
        vote_value
      ])
      post_vote = vote
    } catch (e) {
      res.status(409).send({ error: 'You have already voted on this post' })
    }

    res.status(201).send(post_vote)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.put('/:post_id', auth, async (req, res) => {
  try {
    const { post_id } = req.params
    const { vote_value } = req.body

    const { status, error } = await checkVoteValid(post_id, vote_value)
    if (error) {
      return res.status(status).send({ error })
    }

    const updatePostVoteStatement = `
      update post_votes
      set vote_value = $1
      where user_id = $2 and post_id = $3
      returning *
    `

    const { rows: [post_vote] } = await query(updatePostVoteStatement, [
      vote_value,
      req.user.id,
      post_id
    ])

    res.send(post_vote)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

module.exports = router