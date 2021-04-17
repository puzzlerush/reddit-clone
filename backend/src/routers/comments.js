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

router.get('/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params
    const selectPostStatement = `
      select
      c.id comment_id, c.body comment_body, c.created_at comment_created_at, c.updated_at comment_updated_at,
      cu.username comment_author_name,
      p.id, p.type, p.title, p.body, p.created_at, p.updated_at,
      pu.username post_author_name,
      sr.name subreddit_name
      from comments c
      inner join users cu on c.author_id = cu.id
      inner join posts p on c.post_id = p.id
      inner join users pu on p.author_id = pu.id
      inner join subreddits sr on p.subreddit_id = sr.id
      where p.id = $1
    `
    const { rows } = await query(selectPostStatement, [post_id])

    if (rows.length === 0) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    }

    const post = { ...rows[0] }
    Object.keys(post).forEach((key) => {
      if (key.startsWith('comment_')) {
        delete post[key]
      }
    })

    const comments = rows.map((row) => {
      const {
        comment_id: id,
        comment_body: body,
        comment_created_at: created_at,
        comment_updated_at: updated_at,
        comment_author_name: author_name,
      } = row
      return { id, body, created_at, updated_at, author_name }
    })

    res.send({ post, comments })
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