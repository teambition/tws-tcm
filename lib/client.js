'use strict'
const url = require('url')
const GrpcClient = require('./grpc')
const HTTPClient = require('./http')

class Client {
  constructor (options) {
    if (options.mode && typeof options.mode === 'string' && options.mode.toLowerCase() === 'grpc') {
      options.mode = 'grpc'
    } else {
      options.mode = 'http'
    }

    this.options = options
    this.options.timeout = options.timeout || 2000

    this.client = this.options.mode === 'http'
                  ? new HTTPClient(options)
                  : new GrpcClient(
                      url.parse(this.options.host).host,
                      this.options.timeout,
                      this.options.rootCert,
                      this.options.privateKey,
                      this.options.certChain
                    )
  }

  subscribe () { return this._request('subscribe', Array.from(arguments)) }
  unsubscribe () { return this._request('unsubscribe', Array.from(arguments)) }
  send () { return this._request('send', Array.from(arguments)) }
  getUserClients () { return this._request('getUserClients', Array.from(arguments)) }
  sign () { return this._request('sign', Array.from(arguments)) }

  _request (method, args) { return this.client[method](...args) }
}

module.exports = Client
