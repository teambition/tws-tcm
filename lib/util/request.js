'use strict'
const createError = require('http-errors')

function assertRes ({ res }) {
  if (String(res.status).startsWith('2')) return res.data

  const lookupInfo = ` remoteAddress: ${res.remoteAddress} remotePort: ${res.remotePort}`

  if (!res.data) throw createError(res.status, lookupInfo)

  let { error, message, data } = res.data
  if (error) {
    error += lookupInfo
    throw createError(res.status, error, { message, data })
  }

  throw createError(res.status, JSON.stringify(res.data) + lookupInfo)
}

module.exports = { assertRes }
