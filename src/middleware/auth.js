const jwt = require('jsonwebtoken')
const { query } = require('../db')

module.exports = async (req, res, next) => {
  try {
    const token = req.get('Authorization').replace('Bearer ', '')
    const { id } = await jwt.verify(token, process.env.JWT_SECRET)
    const { rows: [user] } = await query('select * from users where id = $1', [id])
    if (!user.tokens.includes(token)) {
      throw new Error();
    }
    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' })
  }
}