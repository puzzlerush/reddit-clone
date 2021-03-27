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

module.exports = {
  updateTableRow
}