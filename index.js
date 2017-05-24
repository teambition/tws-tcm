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

    this.authClient = new AuthClient({
      appId: this.options.appId,
      appSecret: this.options.appSecret,
      resourceType: this.options.resourceType,
      host: this.options.authHost,
      cacheStore: this.options.cacheStore
    })
  }

  subscribe (topic, _sessionId) {
    return co(function * () {
      return assertRes(yield urllib.request(`${this.options.host}/subscribe`, {
        method: 'POST',
        contentType: 'json',
        dataType: 'json',
        data: { topic, s_id: _sessionId },
        headers: { Authorization: `Bearer ${yield this.authClient.auth.authorize()}` }
      }))
    }.bind(this))
  }

  unsubscribe (topic, _sessionId) {
    return co(function * () {
      return assertRes(yield urllib.request(`${this.options.host}/unsubscribe`, {
        method: 'POST',
        contentType: 'json',
        dataType: 'json',
        data: { topic, s_id: _sessionId },
        headers: { Authorization: `Bearer ${yield this.authClient.auth.authorize()}` }
      }))
    }.bind(this))
  }

  send (body) {
    return co(function * () {
      if (!Array.isArray(body)) body = [body]

      return assertRes(yield urllib.request(`${this.options.host}/send`, {
        method: 'POST',
        contentType: 'json',
        dataType: 'json',
        data: body,
        headers: { Authorization: `Bearer ${yield this.authClient.auth.authorize()}` }
      }))
    }.bind(this))
  }

  getUserClients (_userId) {
    return co(function * () {
      return assertRes(yield urllib.request(`${this.options.host}/users/${_userId}/clients`, {
        method: 'GET',
        dataType: 'json',
        headers: { Authorization: `Bearer ${yield this.authClient.auth.authorize()}` }
      }))
    }.bind(this))
  }

  sign (_userId, source, expire) {
    return co(function * () {
      return assertRes(yield urllib.request(`${this.options.host}/users/${_userId}/sign`, {
        method: 'POST',
        contentType: 'json',
        dataType: 'json',
        data: { source, expire },
        headers: { Authorization: `Bearer ${yield this.authClient.auth.authorize()}` }
      }))
    }.bind(this))
  }
}

module.exports = Client
