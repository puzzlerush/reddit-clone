const express = require('express')
const { query } = require('../db')
const { updateTableRow } = require('../db/utils')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await query('select * from posts')
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const selectPostStatement = `select * from posts where id = $1`
    const { rows: [post] } = await query(selectPostStatement, [id])
    
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
    const { type, title, body } = req.body
    
    const createPostStatement = `
      insert into posts(type, title, body, author_id)
      values($1, $2, $3, $4)
      returning *
    `

    const { rows: [post] } = await query(createPostStatement, [type, title, body, req.user.id])
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
      return res.status(401).send({ error: 'You must be the post creator to edit it' })
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