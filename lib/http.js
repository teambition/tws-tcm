'use strict'

const UaComposer = require('user-agent-composer')
const uuid = require('uuid/v4')
const appRoot = require('app-root-path')
const appInfo = require(`${appRoot}/package.json`)
const pkg = require('../package.json')
const { request, assertRes } = require('tws-auth')

const UA = new UaComposer().product(pkg.name, pkg.version)
                           .ext(`Node.js/${process.version}`)
                           .ext(`${appInfo.name}/${appInfo.version}`)
                           .ext(`pid/${process.pid}`)
                           .build()

class Client {
  constructor (options) {
    options.timeout = options.timeout || 3000
    options.pool = options.pool || { maxSockets: options.maxSockets || 100 }
    this.host = options.host || 'https://tcm.teambitionapis.com'
    this.options = options
  }

  subscribe (topic, _sessionId, token) {
    return this._requestWithToken(
      'POST',
      '/subscribe',
      { topic, s_id: _sessionId },
      token
    )
  }

  unsubscribe (topic, _sessionId, token) {
    return this._requestWithToken(
      'POST',
      '/unsubscribe',
      { topic, s_id: _sessionId },
      token
    )
  }

  send (body, token) {
    return this._requestWithToken(
      'POST',
      '/send',
      body,
      token
    )
  }

  getUserClients (_userId, token) {
    return this._requestWithToken(
      'GET',
      `/users/${_userId}/clients`,
      null,
      token
    )
  }

  sign (_userId, source, token) {
    return this._requestWithToken(
      'POST',
      `/users/${_userId}/sign`,
      { source },
      token
    )
  }

  heartBeat (token) {
    return this._requestWithToken(
      'GET',
      '/',
      null,
      token
    )
  }

  _requestWithToken (method, url, data, token) {
    // request with retry for Network Errors
    return request({
      method,
      url,
      baseUrl: this.host,
      json: true,
      forever: true,
      body: data,
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': UA },
      qs: this.options.addUUID && { uuid: uuid() },
      timeout: this.options.timeout,
      cert: this.options.certChain,
      key: this.options.privateKey,
      ca: this.options.rootCert,
      pool: this.options.pool,
      time: this.options.time,
      retryDelay: 500,
      maxAttempts: 3
    }).then(assertRes)
  }
}

module.exports = Client
