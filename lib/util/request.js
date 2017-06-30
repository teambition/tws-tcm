'use strict'
const createError = require('http-errors')

function assertRes ({ res }) {
  if (String(res.status).startsWith('2')) return res.data

  if (!res.data) throw createError(res.status)

  let { error, message, data } = res.data
  if (error) {
    error += ` remoteAddress: ${res.remoteAddress} remotePort: ${res.remotePort}`
    throw createError(res.status, error, { message, data })
  }

  throw createError(res.status, JSON.stringify(res.data))
}

module.exports = { assertRes }
