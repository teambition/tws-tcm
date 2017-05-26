'use strict'
const AuthClient = require('tws-auth')
const validator = require('validator')
const urllib = require('urllib')
const co = require('co')
const { assertRes } = require('./util/request')

class Client {
  constructor (options) {
    if (!validator.isMongoId(options.appId)) {
      throw new Error(`appId: ${options.appId} is not a valid mongo id`)
    }

    this.options = options
    this.options.resourceType = options.resourceType || 'app'
    this.options.authHost = options.authHost || 'https://auth.teambitionapis.com'
    this.options.host = options.host || 'https://tcm.teambitionapis.com'
    this.options.timeout = options.timeout || 2000

    this.authClient = new AuthClient({
      appId: this.options.appId,
      appSecret: this.options.appSecret,
      resourceType: this.options.resourceType,
      host: this.options.authHost,
      cacheStore: this.options.cacheStore,
      timeout: this.options.timeout
    })
  }

  subscribe (topic, _sessionId) {
    return this._requestWithToken('POST', `${this.options.host}/subscribe`, {
      topic, s_id: _sessionId
    })
  }

  unsubscribe (topic, _sessionId) {
    return this._requestWithToken('POST', `${this.options.host}/unsubscribe`, {
      topic, s_id: _sessionId
    })
  }

  send (body) {
    return this._requestWithToken('POST', `${this.options.host}/send`, body)
  }

  getUserClients (_userId) {
    return this._requestWithToken('GET',
      `${this.options.host}/users/${_userId}/clients`)
  }

  sign (_userId, source, expire) {
    return this._requestWithToken('POST',
      `${this.options.host}/users/${_userId}/sign`, { source, expire })
  }

  _requestWithToken (method, url, data) {
    return co(function * () {
      return assertRes(yield urllib.request(url, {
        method,
        data,
        contentType: 'json',
        dataType: 'json',
        timeout: this.options.timeout,
        headers: { Authorization: `Bearer ${yield this.authClient.auth.authorize()}` }
      }))
    }.bind(this))
  }
}

module.exports = Client
