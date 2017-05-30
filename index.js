'use strict'
const validator = require('validator')
const urllib = require('urllib')
const co = require('co')
const GrpcClient = require('./grpc')
const { assertRes } = require('./util/request')

class Client {
  constructor (options) {
    if (!validator.isMongoId(options.appId)) {
      throw new Error(`appId: ${options.appId} is not a valid mongo id`)
    }

    this.options = options
    this.options.host = options.host || 'https://tcm.teambitionapis.com'
    this.options.timeout = options.timeout || 2000
    this.grpc = new GrpcClient(this.options.host)
  }

  subscribe (topic, _sessionId, token) {
    return this._requestWithToken('POST', `${this.options.host}/subscribe`, { topic, s_id: _sessionId }, token)
  }

  unsubscribe (topic, _sessionId, token) {
    return this._requestWithToken('POST', `${this.options.host}/unsubscribe`, { topic, s_id: _sessionId }, token)
  }

  send (body, token) {
    return this._requestWithToken('POST', `${this.options.host}/send`, body, token)
  }

  getUserClients (_userId, token) {
    return this._requestWithToken('GET', `${this.options.host}/users/${_userId}/clients`, token)
  }

  sign (_userId, source, expire, token) {
    return this._requestWithToken('POST', `${this.options.host}/users/${_userId}/sign`, { source, expire }, token)
  }

  _requestWithToken (method, url, data, token) {
    return co(function * () {
      return assertRes(yield urllib.request(url, {
        method,
        data,
        contentType: 'json',
        dataType: 'json',
        timeout: this.options.timeout,
        headers: { Authorization: `Bearer ${token}` }
      }))
    }.bind(this))
  }
}

module.exports = Client
