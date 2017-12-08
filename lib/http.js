'use strict'
const request = require('request')
const UaComposer = require('user-agent-composer')
const uuid = require('uuid/v4')
const createError = require('http-errors')
const appRoot = require('app-root-path')
const appInfo = require(`${appRoot}/package.json`)
const pkg = require('../package.json')

const UA = new UaComposer().product(pkg.name, pkg.version)
                           .ext(`Node.js/${process.version}`)
                           .ext(`${appInfo.name}/${appInfo.version}`)
                           .ext(`pid/${process.pid}`)
                           .build()

class Client {
  constructor (options) {
    this.options = options
    this.options.host = options.host || 'https://tcm.teambitionapis.com'
  }

  subscribe (topic, _sessionId, token) {
    return this._requestWithToken(
      'POST',
      this._assembleRequestUrl(`${this.options.host}/subscribe`),
      { topic, s_id: _sessionId },
      token
    )
  }

  unsubscribe (topic, _sessionId, token) {
    return this._requestWithToken(
      'POST',
      this._assembleRequestUrl(`${this.options.host}/unsubscribe`),
      { topic, s_id: _sessionId },
      token
    )
  }

  send (body, token) {
    return this._requestWithToken(
      'POST',
      this._assembleRequestUrl(`${this.options.host}/send`),
      body,
      token
    )
  }

  getUserClients (_userId, token) {
    return this._requestWithToken(
      'GET',
      this._assembleRequestUrl(`${this.options.host}/users/${_userId}/clients`),
      null,
      token
    )
  }

  sign (_userId, source, token) {
    return this._requestWithToken(
      'POST',
      this._assembleRequestUrl(`${this.options.host}/users/${_userId}/sign`),
      { source },
      token
    )
  }

  heartBeat (token) {
    return this._requestWithToken(
      'GET',
      this._assembleRequestUrl(this.options.host),
      null,
      token
    )
  }

  _assembleRequestUrl (url) {
    if (!this.options.addUUID) return url
    let [path, query] = url.split('?')

    if (!query) query = `uuid=${uuid()}`
    else query += `&uuid=${uuid()}`

    return `${path}?${query}`
  }

  _requestWithToken (method, url, data, token) {
    return new Promise((resolve, reject) => {
      request({
        method,
        url,
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': UA },
        json: true,
        forever: true,
        body: data,
        timeout: this.options.timeout,
        cert: this.options.certChain,
        key: this.options.privateKey,
        ca: this.options.rootCert,
        pool: { maxSockets: this.options.maxSockets }
      }, function (err, res, body) {
        if (err) return reject(err)
        if (String(res.statusCode).startsWith('2')) return resolve(body)

        const lookupInfo = [
          ` localAddress: ${res.socket.localAddress}`,
          `localPort: ${res.socket.localPort}`,
          `remoteAddress: ${res.socket.remoteAddress}`,
          `remotePort: ${res.socket.remotePort}`
        ].join(' ')

        if (!res.body) return reject(createError(res.statusCode, lookupInfo))

        let { error, message, data } = res.body
        if (error) {
          error += lookupInfo
          return reject(createError(res.statusCode, error, { message, data }))
        }

        return reject(createError(res.statusCode, JSON.stringify(res.body) + lookupInfo))
      })
    })
  }
}

module.exports = Client
