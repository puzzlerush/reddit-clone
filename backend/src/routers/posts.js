const express = require('express')
const { query } = require('../db')
const { updateTableRow } = require('../db/utils')
const auth = require('../middleware/auth')()
const optionalAuth = require('../middleware/auth')(true)

const router = express.Router()

const selectPostStatement = `
  select
  p.id, p.type, p.title, p.body, p.created_at, p.updated_at,
  cast(coalesce(sum(pv.vote_value), 0) as int) votes,
  max(upv.vote_value) has_voted,
  (select cast(count(*) as int) from comments c where p.id = c.post_id and c.body is not null) number_of_comments,
  max(u.username) author_name,
  max(sr.name) subreddit_name
  from posts p
  left join users u on p.author_id = u.id
  inner join subreddits sr on p.subreddit_id = sr.id
  left join post_votes pv on p.id = pv.post_id
  left join post_votes upv on p.id = upv.post_id and upv.user_id = $1
  group by p.id
`

router.get('/', optionalAuth, async (req, res) => {
  try {
    const allowedFilters = ['subreddit', 'author']
    const columnNamesEnum = {
      'subreddit': 'max(sr.name)',
      'author': 'max(u.username)'
    }
    const validFilters = Object.keys(req.query).every((key) => allowedFilters.includes(key))
    if (!validFilters) {
      return res.status(400).send({ error: `The only allowed filters are ${allowedFilters.join(', ')}`})
    } 

    const user_id = req.user ? req.user.id : -1
    const queryArgs = [user_id]
    
    const havingAndClause = []
    Object.entries(req.query).forEach(([filterName, filterValue]) => {
      queryArgs.push(filterValue)
      havingAndClause.push(`${columnNamesEnum[filterName]} = $${queryArgs.length}`)
    })
    
    const selectFilteredPostsStatement = `
      ${selectPostStatement}
      having p.title is not null
      ${havingAndClause.length > 0 ? 'and' : ''} ${havingAndClause.join(' and ')}
      order by votes desc
    `

    const { rows } = await query(selectFilteredPostsStatement, queryArgs)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user ? req.user.id : -1
    const { rows: [post] } = await query(`${selectPostStatement} having p.id = $2`, [user_id, id])
    if (!post) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    }

    res.send(post)
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

    // Automatically upvote your own post
    const createVoteStatement = `insert into post_votes values ($1, $2, $3)`
    await query(createVoteStatement, [req.user.id, post.id, 1])

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

    // const deletePostStatement = `delete from posts where id = $1 returning *`
    // const { rows: [deletedPost] } = await query(deletePostStatement, [id])
    // res.send(deletedPost)

    const setFieldsToNullStatement = `
      update posts
      set title = null,
          body = null,
          author_id = null
      where id = $1
      returning *
    `

    const { rows: [deletedPost] } = await query(setFieldsToNullStatement, [id])
    res.send(deletedPost)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router