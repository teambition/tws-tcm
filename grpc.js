'use strict'
const path = require('path')
const grpc = require('grpc')
const grpcPromise = require('grpc-promise')

const PROTO_PATH = path.join(__dirname, './proto/broker.proto')
const Proto = grpc.load(PROTO_PATH).outerbroker

class Client {
  constructor (address, credentials) {
    this.outerBrokerClient = new Proto.OuterBroker(
      address,
      grpc.credentials.createInsecure(),
      { 'grpc.primary_user_agent': 'tws-tcm' }
    )

    grpcPromise.promisifyAll(this.outerBrokerClient)
  }

  subscribe (topic, _sessionId) {
    return this.outerBrokerClient.subscribe({ topic, s_id: _sessionId })
  }

  unsubscribe (topic, _sessionId) {
    return this.outerBrokerClient.unsubscribe({ topic, s_id: _sessionId })
  }

  send (body) {
    return this.outerBrokerClient.send(body)
  }

  getUserClients (_userId) {
    return this.outerBrokerClient.listClients({ user_id: _userId })
  }

  sign (_userId, source, expire) {
    return this.outerBrokerClient.sign({ user_id: _userId, source, expire })
  }
}

module.exports = Client
