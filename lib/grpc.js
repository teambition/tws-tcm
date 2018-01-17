'use strict'

const url = require('url')
const path = require('path')
const grpc = require('grpc')
const co = require('co')

const PROTO_PATH = path.join(__dirname, '../proto/broker.proto')
const Proto = grpc.load(PROTO_PATH).outerbroker

class Client {
  constructor (host, timeout, rootCerts, privateKey, certChain) {
    let credentials
    let urlObj = url.parse(host)

    if (urlObj.protocol === 'http:') {
      credentials = grpc.credentials.createInsecure()
    } else {
      let sslOptions = []
      if (rootCerts) sslOptions.push(rootCerts)
      if (privateKey && certChain) sslOptions.push(Buffer.from(privateKey), Buffer.from(certChain))
      credentials = grpc.credentials.createSsl(...sslOptions)
    }

    this.timeout = timeout
    this.outerBrokerClient = new Proto.OuterBroker(
      urlObj.host,
      credentials,
      { 'grpc.primary_user_agent': 'tws-tcm-node-client' }
    )
  }

  subscribe (topic, _sessionId, token) {
    return this._promisifyWithRetry('subscribe', { topic, s_id: _sessionId }, token)
  }

  unsubscribe (topic, _sessionId, token) {
    return this._promisifyWithRetry('unsubscribe', { topic, s_id: _sessionId }, token)
  }

  send (body, token) {
    return this._promisifyWithRetry('send', body, token)
  }

  getUserClients (_userId, token) {
    return this._promisifyWithRetry('listClients', { user_id: _userId }, token)
  }

  sign (_userId, source, token) {
    return this._promisifyWithRetry('sign', { user_id: _userId, source }, token)
  }

  _promisify (method, args, token) {
    return new Promise((resolve, reject) => {
      let meta = new grpc.Metadata()
      meta.set('authorization', `Bearer ${token}`)

      this.outerBrokerClient[method](
        args,
        meta,
        { deadline: Date.now() + this.timeout },
        function (err, response) {
          if (err) return reject(err)
          return resolve(response)
        })
    })
  }

  _promisifyWithRetry (method, args, token) {
    return co(function * () {
      let retry = 0

      // NOTE: Retry when the error code of the response is 13 or 14
      // https://github.com/grpc/grpc/blob/master/src/node/src/constants.js#L135
      // https://github.com/grpc/grpc/blob/master/src/node/src/constants.js#L143
      while (true) {
        try {
          return yield this._promisify(method, args, token)
        } catch (error) {
          if (error && (error.code === 14 || error.code === 13) && retry++ < 3) continue
          else throw error
        }
      }
    }.bind(this))
  }
}

module.exports = Client
