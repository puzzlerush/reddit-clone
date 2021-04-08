const express = require('express')
const { query } = require('../db')
const { updateTableRow } = require('../db/utils')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const selectPostStatement = `
      select
      p.id, p.type, p.title, p.body, p.created_at, p.updated_at,
      count(c.id) number_of_comments,
      max(u.username) author_name,
      max(sr.name) subreddit_name
      from posts p
      inner join users u on p.author_id = u.id
      inner join subreddits sr on p.subreddit_id = sr.id
      left join comments c on p.id = c.post_id
      group by p.id
    `
    const { rows } = await query(selectPostStatement)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
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
    const { rows } = await query(selectPostStatement, [id])

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
    const { type, title, body, subreddit } = req.body
    if (!type) {
      throw new Error('Must specify post type')
    }
    if (!title) {
      throw new Error('Must specify post title')
    }
    if (type === 'link' && !body) {
      throw new Error('Must specify link post URL')
    }
    if (!subreddit) {
      throw new Error('Must specify subreddit')
    }

    const selectSubredditIdStatement = `select * from subreddits where name = $1`

    const { rows: [foundSubreddit] } = await query(selectSubredditIdStatement, [subreddit])

    if (!foundSubreddit) {
      throw new Error('Subreddit does not exist')
    }

    const createPostStatement = `
      insert into posts(type, title, body, author_id, subreddit_id)
      values($1, $2, $3, $4, $5)
      returning *
    `

    const { rows: [post] } = await query(createPostStatement, [
      type,
      title,
      body,
      req.user.id,
      foundSubreddit.id
    ])
    res.status(201).send(post)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const selectPostStatement = `select * from posts where id = $1`
    const { rows: [post] } = await query(selectPostStatement, [id])

    if (!post) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    }
    if (post.author_id !== req.user.id) {
      return res.status(403).send({ error: 'You must be the post creator to edit it' })
    }

    let allowedUpdates
    switch (post.type) {
      case 'text':
        allowedUpdates = ['title', 'body']
        break
      case 'link':
        allowedUpdates = ['title']
        break
      default:
        allowedUpdates = []
    }

    const updatedPost = await updateTableRow('posts', id, allowedUpdates, req.body)
    res.send(updatedPost)
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: e.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const selectPostStatement = `select * from posts where id = $1`
    const { rows: [post] } = await query(selectPostStatement, [id])

    if (!post) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    }
    if (post.author_id !== req.user.id) {
      return res.status(401).send({ error: 'You must be the post creator to delete it' })
    }

    const deletePostStatement = `delete from posts where id = $1 returning *`
    const { rows: [deletedPost] } = await query(deletePostStatement, [id])
    res.send(deletedPost)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router