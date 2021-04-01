const { query } = require('./index')

const updateTableRow = async (table, id, allowedUpdates, updatesObj) => {
  if (allowedUpdates.length < 1) {
    throw new Error('No updates allowed')
  }
  const updateFields = Object.keys(updatesObj)
  const validUpdate = updateFields.every((updateField) => allowedUpdates.includes(updateField))
  if (!validUpdate) {
    const fieldsString = allowedUpdates.length > 1
      ? allowedUpdates.slice(0, allowedUpdates.length - 1).join(', ') + ` and ${allowedUpdates[allowedUpdates.length - 1]}`
      : allowedUpdates[0]
    throw new Error(`Only the ${fieldsString} ${allowedUpdates.length === 1 ? 'field' : 'fields'} can be updated`)
  }

  const setFieldsClause = updateFields.map(
    (updateField, index) => `${updateField} = $${index + 1}`
  ).join(', ')

  const updateFieldsParams = []
  updateFields.forEach((updateField) => {
    updateFieldsParams.push(updatesObj[updateField])
  })

  const updateTableStatement = `
    update ${table}
    set ${setFieldsClause}
    where id = $${updateFields.length + 1}
    returning *
  `

  const { rows: [updatedRow] } = await query(updateTableStatement, [...updateFieldsParams, id])
  return updatedRow
}

const selectModeratorsStatement = `
  select u.username moderator_name, sr.name subreddit_name
  from moderators m
  inner join users u on m.user_id = u.id
  inner join subreddits sr on m.subreddit_id = sr.id
`

const userIsModerator = async (username, subreddit) => {
  const findSubredditModeratorStatement = `
    ${selectModeratorsStatement}
    where u.username = $1 and sr.name = $2
  `
  const { rows: [moderator] } = await query(findSubredditModeratorStatement, [
    username,
    subreddit
  ])

  return !!moderator
}

module.exports = {
  updateTableRow,
  selectModeratorsStatement,
  userIsModerator
}