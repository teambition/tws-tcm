'use strict'
const tman = require('tman')
const MemoryStore = require('tws-auth/cache/memory')
const Client = require('../index')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

tman.suite('Client', function () {
  let client = new Client({
    cacheStore: new MemoryStore(),
    appId: '58f95e92c06a546f7dab73c7',
    appSecret: 'hello123',
    resourceType: 'self',
    host: 'https://192.168.0.21:30700',
    authHost: 'http://192.168.0.21:31090'
  })

  tman.it('subscribe', function * () {
    let result = yield client.subscribe('test_topic', 'test_s_id')
    console.log(result)
  })

  tman.it('unsubscribe', function * () {
    let result = yield client.unsubscribe('test_topic', 'test_s_id')
    console.log(result)
  })

  tman.it('send', function * () {
    let result = yield client.send([{
      'to': 'some_topic',
      'collapse_key': 'collapse_key',
      'time_to_live': 60,
      'data': 'data1'
    }, {
      'to': 'some_topic',
      'collapse_key': 'collapse_key',
      'time_to_live': 60,
      'data': 'data2'
    }])
    console.log(result)
  })

  tman.it('getUserClients', function * () {
    let result = yield client.getUserClients('55c02075283447b14c263fe8')
    console.log(result)
  })

  tman.it('sign', function * () {
    let result = yield client.sign('55c02075283447b14c263fe8', 'source', 2000)
    console.log(result)
  })
})
