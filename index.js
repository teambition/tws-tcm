'use strict'
const url = require('url')
const GrpcClient = require('./lib/grpc')
const HTTPClient = require('./lib/http')

module.exports = class Client extends HTTPClient {
  constructor (options) {
    super(options)

    this.grpc = new GrpcClient(
      url.parse(this.options.host).host,
      this.options.rootCert,
      this.options.privateKey,
      this.options.certChain
    )
  }
}
