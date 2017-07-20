'use strict'
const urllib = require('urllib')
const co = require('co')
const UaComposer = require('user-agent-composer')
const Agent = require('agentkeepalive')
const uuid = require('uuid/v4')
const { assertRes } = require('./util/request')
const pkg = require('../package.json')

const UA = new UaComposer().product(pkg.name, pkg.version)
                           .ext(`Node.js/${process.version}`)
                           .build()

class Client {
  constructor (options) {
    this.options = options
    this.options.host = options.host || 'https://tcm.teambitionapis.com'
    this.httpAgent = new Agent()
    this.httpsAgent = new Agent.HttpsAgent()
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

  _assembleRequestUrl (url) {
    if (!this.options.addUUID) return url
    let [path, query] = url.split('?')

    if (!query) query = `uuid=${uuid()}`
    else query += `&uuid=${uuid()}`

    return `${path}?${query}`
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
        agent: this.httpAgent,
        httpsAgent: this.httpsAgent,
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': UA }
      }))
    }.bind(this))
  }
}

module.exports = Client
