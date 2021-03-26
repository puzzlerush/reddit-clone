const { query } = require('./index')

const updateTableRow = async (table, id, allowedUpdates, updatesObj) => {
  const updateFields = Object.keys(updatesObj)
  const validUpdate = updateFields.every((updateField) => allowedUpdates.includes(updateField))
  if (!validUpdate) {
    throw new Error(`Only the ${allowedUpdates.join(', ')} fields can be updated`)
  }

  const setFieldsClause = updateFields.map(
    (updateField, index) => `${updateField} = $${index + 1}`
  ).join(', ')

  const updateFieldsParams = [];
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