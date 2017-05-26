'use strict'
const tman = require('tman')
const assert = require('power-assert')
const requestUtil = require('../../util/request')

tman.suite('util - request', function () {
  tman.suite('assertRes', function () {
    tman.it('response with 2xx status', function () {
      assert(requestUtil.assertRes({ res: { status: 200, data: 'test' } }) === 'test')
    })

    tman.it('reponse with tws error style', function () {
      assert.throws(() => requestUtil.assertRes({ res: {
        status: 400,
        data: { error: 'ParamError', message: 'test_message', data: 'data' }
      } }), 'ParamError')
    })
  })
})
