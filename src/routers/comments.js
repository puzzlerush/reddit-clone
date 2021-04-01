const express = require('express')
const { query } = require('../db')
const { updateTableRow, userIsModerator } = require('../db/utils')
const auth = require('../middleware/auth')

const router = express.Router()

const selectCommentStatement = `
  select c.id, c.author_id, c.post_id, c.parent_comment_id, sr.name subreddit_name
  from comments c
  inner join posts p on c.post_id = p.id
  inner join subreddits sr on p.subreddit_id = sr.id
  where c.id = $1
`

router.get('/', async (req, res) => {
  try {
    const selectCommentsStatement = `select * from comments`
    const { rows } = await query(selectCommentsStatement)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { body, post_id, parent_comment_id } = req.body
    if (!body) {
      throw new Error('Must specify comment body')
    }
    if (!post_id) {
      throw new Error('Must specify post to comment on')
    }
    const insertCommentStatement = `
      insert into comments(body, author_id, post_id, parent_comment_id)
      values($1, $2, $3, $4)
      returning *
    `
    const { rows: [comment] } = await query(insertCommentStatement, [
      body,
      req.user.id,
      post_id,
      parent_comment_id
    ])

    res.status(201).send(comment)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    const { rows: [comment] } = await query(selectCommentStatement, [id])
    if (!comment) {
      return res.status(404).send({ error: 'Could not find comment with that id' })
    }
    if ((comment.author_id !== req.user.id)
        && (await userIsModerator(req.user.username, comment.subreddit_name) === false)) {
      return res.status(403).send({ error: 'You must the comment author to edit it' })
    }
    console.log(comment)

    const updatedComment = await updateTableRow('comments', id, ['body'], req.body)

    res.send(updatedComment)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { rows: [comment] } = await query(selectCommentStatement, [id])
    if (!comment) {
      return res.status(404).send({ error: 'Could not find comment with that id' })
    }
    if ((comment.author_id !== req.user.id)
        && (await userIsModerator(req.user.username, comment.subreddit_name) === false)) {
      return res.status(403).send({ error: 'You must be the comment author to delete it' })
    }

    const deleteCommentStatement = `delete from comments where id = $1 returning *`
    const { rows: [deletedComment] } = await query(deleteCommentStatement, [id])
    
    res.send(deletedComment)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router