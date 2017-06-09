'use strict'
const urllib = require('urllib')
const co = require('co')
const UaComposer = require('user-agent-composer')
const { assertRes } = require('./util/request')
const pkg = require('../package.json')

const UA = new UaComposer().product(pkg.name, pkg.version)
                           .ext(`Node.js/${process.version}`)
                           .build()

class Client {
  constructor (options) {
    this.options = options
    this.options.host = options.host || 'https://tcm.teambitionapis.com'
    this.options.timeout = options.timeout || 2000
  }

  subscribe (topic, _sessionId, token) {
    return this._requestWithToken(
      'POST',
      `${this.options.host}/subscribe`,
      { topic, s_id: _sessionId },
      token
    )
  }

  unsubscribe (topic, _sessionId, token) {
    return this._requestWithToken(
      'POST',
      `${this.options.host}/unsubscribe`,
      { topic, s_id: _sessionId },
      token
    )
  }

  send (body, token) {
    return this._requestWithToken(
      'POST',
      `${this.options.host}/send`,
      body,
      token
    )
  }

  getUserClients (_userId, token) {
    return this._requestWithToken(
      'GET',
      `${this.options.host}/users/${_userId}/clients`,
      null,
      token
    )
  }

  sign (_userId, source, token) {
    return this._requestWithToken(
      'POST',
      `${this.options.host}/users/${_userId}/sign`,
      { source },
      token
    )
  }

  _requestWithToken (method, url, data, token) {
    return co(function * () {
      return assertRes(yield urllib.request(url, {
        method,
        data,
        contentType: 'json',
        dataType: 'json',
        ca: this.options.rootCert,
        key: this.options.privateKey,
        cert: this.options.certChain,
        timeout: this.options.timeout,
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': UA }
      }))
    }.bind(this))
  }
}

module.exports = Client
