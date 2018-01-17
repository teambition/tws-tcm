'use strict'

const tman = require('tman')
const assert = require('power-assert')
const AuthClient = require('tws-auth')
const GrpcClient = require('../lib/grpc')

tman.suite('GRPC Client', function () {
  this.timeout(10000)

  let client = new GrpcClient('https://tcm-demo.teambition.net:1443', 10000)

  let authClient = new AuthClient({
    cacheStore: new AuthClient.MemoryStore(),
    host: 'https://121.196.214.67:31090',
    appId: '59294da476d70b4b83fa91a5',
    appSecret: process.env.APP_SECRET,
    timeout: 30000
  })

  let token
  tman.before(function * () {
    token = yield authClient.authorize('59294da476d70b4b83fa91a5', 'self')
  })

  tman.it('subscribe', function * () {
    const subscribeResult = yield client.subscribe('test_topic', 'test_s_id', token)
    assert(Object.keys(subscribeResult).length === 0)
  })

  tman.it('unsubscribe', function * () {
    let unsubscribeResult = yield client.unsubscribe('test_topic', 'test_s_id', token)
    assert(Object.keys(unsubscribeResult).length === 0)
  })

  tman.it('send', function * () {
    const sendResult = yield client.send([{
      to: 'some_topic',
      collapse_key: 'collapse_key',
      time_to_live: 60,
      data: 'data1'
    }, {
      to: 'some_topic',
      collapse_key: 'collapse_key',
      time_to_live: 60,
      data: 'data2'
    }], token)

    assert(Object.keys(sendResult).length === 0)
  })

  tman.it('getUserClients', function * () {
    let result = yield client.getUserClients('55c02075283447b14c263fe8', token)

    assert(typeof result.total === 'number')
    assert(typeof result.android === 'number')
    assert(typeof result.ios === 'number')
    assert(typeof result.web === 'number')
  })

  tman.it('sign', function * () {
    assert((yield client.sign('55c02075283447b14c263fe8', 'source', token)).length !== 0)
  })
})
