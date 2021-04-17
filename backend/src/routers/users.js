const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { query } = require('../db')
const { updateTableRow } = require('../db/utils')
const auth = require('../middleware/auth')()

const router = express.Router()

const getPublicUser = (user) => {
  delete user.password
  delete user.tokens
  return user
}

const addToken = async (userid) => {
  const token = await jwt.sign({ id: userid }, process.env.JWT_SECRET)

  const updateUserTokensStatement = `
    update users
    set tokens = tokens || $1
    where id = $2
    returning *
  `
  const { rows: [user] } = await query(updateUserTokensStatement, [[token], userid])
  return { user, token }
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await query('select * from users')
    res.send(rows.map((user) => getPublicUser(user)))
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const selectUserStatement = `select * from users where id = $1`

    const { rows: [user] } = await query(selectUserStatement, [id])

    if (!user) {
      return res.status(404).send({ error: 'Could not find user with that id' })
    }
    res.send(getPublicUser(user))
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body
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
      returning *
    `
    let rows
    try {
      ({ rows } = await query(insertUserStatement, [username, hashedPassword]))
    } catch (e) {
      res.status(409).send({ error: 'Username is already taken' })
    }
    
    const { user, token } = await addToken(rows[0].id)

    res.status(201).send({
      user: getPublicUser(user),
      token
    })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      throw new Error('Username and password are required')
    }

    const selectUserStatement = `select * from users where username = $1`

    const { rows } = await query(selectUserStatement, [username])
    const failedLoginError = { error: 'Username or password was incorrect' }

    if (!rows[0]) {
      return res.status(401).send(failedLoginError)
    }

    const isMatch = await bcrypt.compare(password, rows[0].password)
    if (!isMatch) {
      return res.status(401).send(failedLoginError)
    }

    const { user, token } = await addToken(rows[0].id)

    res.send({
      user: getPublicUser(user),
      token
    })

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.post('/logout', auth, async (req, res) => {
  const tokens = req.user.tokens.filter((token) => token !== req.token)
  const setUserTokensStatement = `
    update users
    set tokens = $1
    where id = $2
  `
  const { rows: [user] } = await query(setUserTokensStatement, [tokens, req.user.id])
  delete req.user
  delete req.token
  res.send(user)
})

router.post('/logoutAll', auth, async (req, res) => {
  const clearUserTokensStatement = `
    update users
    set tokens = '{}'
    where id = $1
  `
  const { rows: [user] } = await query(clearUserTokensStatement, [req.user.id])
  delete req.user
  delete req.token
  res.send(user)
})

router.put('/', auth, async (req, res) => {
  try {
    const allowedUpdates = ['username', 'password']
    if (req.body.username !== undefined) {
      const { rows } = await query(`select * from users where username = $1`, [
        req.body.username
      ])
      if (rows.length > 0) {
        return res.status(409).send({ error: 'Username is already taken' })
      }
    }
    if (req.body.password !== undefined) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    const user = await updateTableRow('users', req.user.id, allowedUpdates, req.body)
   
    res.send(getPublicUser(user))
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.delete('/', auth, async (req, res) => {
  try {
    const deleteUserStatement = `delete from users where id = $1 returning *`

    const { rows: [user] } = await query(deleteUserStatement, [req.user.id])

    if (!user) {
      return res.status(404).send({ error: 'Could not find user with that id' })
    }
    res.send(getPublicUser(user))
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router