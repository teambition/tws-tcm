'use strict'
const path = require('path')
const grpc = require('grpc')

const PROTO_PATH = path.join(__dirname, './proto/broker.proto')
const Proto = grpc.load(PROTO_PATH).outerbroker

class Client {
  constructor (address, credentials) {
    this.outerBrokerClient = new Proto.OuterBroker(
      address,
      grpc.credentials.createInsecure(),
      { 'grpc.primary_user_agent': 'tws-tcm' }
    )
  }

  subscribe (topic, _sessionId, token) {
    return this._promisify('subscribe', { topic, s_id: _sessionId }, token)
  }

  unsubscribe (topic, _sessionId, token) {
    return this._promisify('unsubscribe', { topic, s_id: _sessionId }, token)
  }

  send (body, token) {
    return this._promisify('send', body, token)
  }

  getUserClients (_userId, token) {
    return this._promisify('listClients', { user_id: _userId }, token)
  }

  sign (_userId, source, expire, token) {
    return this._promisify('sign', { user_id: _userId, source, expire }, token)
  }

  _promisify (method, args, token) {
    return new Promise((resolve, reject) => {
      let meta = new grpc.Metadata()
      meta.set('authorization', `Bearer ${token}`)

      this.outerBrokerClient[method](args, meta, function (err, response) {
        if (err) return reject(err)
        return resolve(response.message)
      })
    })
  }
}

module.exports = Client
