const express = require('express')
const bcrypt = require('bcrypt')
const { query } = require('../db')

const router = express.Router()

const getPublicUser = (user) => {
  delete user.password
  return user
}

router.get('/', async (req, res) => {
  const { rows } = await query('select * from users')
  res.send(rows.map((user) => getPublicUser(user)))
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const selectUserStatement = `select * from users where id = $1`

    const { rows } = await query(selectUserStatement, [id])
    const user = rows[0]

    if (!user) {
      return res.status(404).send({ error: 'Could not find user with that id' })
    }
    res.send(getPublicUser(user))
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      throw new Error('Username is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const insertUserStatement = `
      insert into users(username, password)
      values($1, $2)
      returning *;
    `

    const { rows } = await query(insertUserStatement, [username, hashedPassword])
    res.status(201).send(getPublicUser(rows[0]));
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const allowedUpdates = ['username', 'password']
    const updates = Object.keys(req.body)
    const validUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!validUpdate) {
      return res.status(400).send()
    }

    const { id } = req.params

    const setFieldsClause = updates.map(
      (update, index) => `${update} = $${index + 1}`
    ).join(', ')

    const updateFieldsParams = [];
    for (const update of updates) {
      if (update === 'password') {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        updateFieldsParams.push(hashedPassword)
      } else {
        updateFieldsParams.push(req.body[update])
      }
    }

    const updateUserStatement = `
      update users
      set ${setFieldsClause}
      where id = $${updateFieldsParams.length + 1}
      returning *
    `

    const { rows } = await query(updateUserStatement, [...updateFieldsParams, id])
    const user = rows[0]
    
    if (!user) {
      return res.status(404).send({ error: 'Could not find user with that id' })
    }
    res.send(getPublicUser(user))
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deleteUserStatement = `delete from users where id = $1 returning *`

    const { rows } = await query(deleteUserStatement, [id])
    const user = rows[0]

    if (!user) {
      return res.status(404).send({ error: 'Could not find user with that id' })
    }
    res.send(getPublicUser(user))
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router