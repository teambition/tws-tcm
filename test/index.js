'use strict'
const tman = require('tman')
const assert = require('power-assert')
const AuthClient = require('tws-auth')
const Client = require('../index')

tman.suite('Client', function () {
  let client = new Client({ host: 'http://192.168.0.21:30700' })
  let authClient = new AuthClient({
    host: 'http://121.196.214.67:31090',
    appId: '59294da476d70b4b83fa91a5',
    appSecret: 'hello123'
  })

  let token
  tman.beforeEach(function * () {
    token = yield authClient.auth.authorize('59294da476d70b4b83fa91a5', 'self')
  })

  tman.it('subscribe', function * () {
    assert((yield client.subscribe('test_topic', 'test_s_id', token)) === null)
  })

  tman.it('unsubscribe', function * () {
    assert((yield client.unsubscribe('test_topic', 'test_s_id', token)) === null)
  })

  tman.it('send', function * () {
    assert((yield client.send([{
      'to': 'some_topic',
      'collapse_key': 'collapse_key',
      'time_to_live': 60,
      'data': 'data1'
    }, {
      'to': 'some_topic',
      'collapse_key': 'collapse_key',
      'time_to_live': 60,
      'data': 'data2'
    }], token)) === null)
  })

  tman.it('getUserClients', function * () {
    let result = yield client.getUserClients('55c02075283447b14c263fe8', token)

    assert(typeof result.total === 'number')
    assert(typeof result.android === 'number')
    assert(typeof result.ios === 'number')
    assert(typeof result.web === 'number')
  })

  tman.it('sign', function * () {
    assert((yield client.sign('55c02075283447b14c263fe8', 'source', 2000, token)).length !== 0)
  })
})
