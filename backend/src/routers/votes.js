const express = require('express')
const { query } = require('../db')
const auth = require('../middleware/auth')()

const router = express.Router()

const checkVoteType = (voteType) => {
  const types = ['post', 'comment']
  let error
  if (!types.includes(voteType)) {
    error = 'Invalid vote type'
  }
  return { voteType, error }
}

const checkVoteValid = async (item_id, vote_value, vote_type) => {
  let status
  let error
  if (!/^\d+$/.test(item_id)) {
    status = 400
    error = `Invalid ${vote_type} id`
  } else if (![-1, 0, 1].includes(parseInt(vote_value))) {
    status = 400
    error = 'Invalid vote value'
  } else {
    const { rows: [item] } = await query(`select * from ${vote_type}s where id = $1`, [item_id])
    if (!item) {
      status = 404
      error = `Could not find ${vote_type} with that id`
    }
  }

  return { status, error }
}

router.get('/:voteType', async (req, res) => {
  try {
    const { voteType, error } = checkVoteType(req.params.voteType)
    if (error) {
      return res.status(400).send({ error })
    }
    const selectPostVotes = `select * from ${voteType}_votes`
    const { rows } = await query(selectPostVotes)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/:voteType', auth, async (req, res) => {
  try {
    const { voteType, error: voteTypeError } = checkVoteType(req.params.voteType)
    if (voteTypeError) {
      return res.status(400).send({ error: voteTypeError })
    }
    const { item_id, vote_value } = req.body

    const { status, error } = await checkVoteValid(item_id, vote_value, voteType)
    if (error) {
      return res.status(status).send({ error })
    }

    const insertItemVoteStatement = `
      insert into ${voteType}_votes
      values($1, $2, $3) returning *
    `
    let item_vote
    try {
      const { rows: [vote] } = await query(insertItemVoteStatement, [
        req.user.id,
        item_id,
        vote_value
      ])
      item_vote = vote
    } catch (e) {
      const updateItemVoteStatement = `
        update ${voteType}_votes
        set vote_value = $1
        where user_id = $2 and ${voteType}_id = $3
        returning *
      `

      const { rows: [vote] } = await query(updateItemVoteStatement, [
        vote_value,
        req.user.id,
        item_id
      ])
      item_vote = vote
    }

    res.status(201).send(item_vote)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

// PUT route is no longer needed, as the POST route
// now also updates if it runs into a conflict

// router.put('/:voteType/:item_id', auth, async (req, res) => {
//   try {
//     const { voteType, error: voteTypeError } = checkVoteType(req.params.voteType)
//     if (voteTypeError) {
//       return res.status(400).send({ error: voteTypeError })
//     }
//     const { item_id } = req.params
//     const { vote_value } = req.body

//     const { status, error } = await checkVoteValid(item_id, vote_value, voteType)
//     if (error) {
//       return res.status(status).send({ error })
//     }

//     const updateItemVoteStatement = `
//       update ${voteType}_votes
//       set vote_value = $1
//       where user_id = $2 and ${voteType}_id = $3
//       returning *
//     `

//     const { rows: [item_vote] } = await query(updateItemVoteStatement, [
//       vote_value,
//       req.user.id,
//       item_id
//     ])

//     res.send(item_vote)
//   } catch (e) {
//     res.status(500).send({ error: e.message })
//   }
// })

module.exports = router