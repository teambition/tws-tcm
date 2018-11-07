'use strict'

import { suite, it, Suite } from 'tman'
import assert from 'assert'
import { TCMClient } from '../src'

suite('HTTP Client', function (this: Suite) {
  this.timeout(5000)
  if (process.env.APP_SECRET == null) {
    it('without configs, skip', () => { return })
    return
  }

  const client = new TCMClient({
    host: process.env.AUTH_SERVER as string,
    appId: process.env.APP_ID as string,
    appSecrets: [process.env.APP_SECRET as string],
    timeout: 5000,
    mode: 'http',
  })

  it('subscribe', async function () {
    const res = await client.subscribe('test_topic', 'test_s_id')
    assert.deepStrictEqual(res, {})
  })

  it('unsubscribe', async function () {
    const res = await client.unsubscribe('test_topic', 'test_s_id')
    assert.deepStrictEqual(res, {})
  })

  it('send', async function () {
    const res = await client.send([{
      to: 'some_topic',
      collapse_key: 'collapse_key',
      time_to_live: 60,
      data: 'data1',
    }, {
      to: 'some_topic',
      collapse_key: 'collapse_key',
      time_to_live: 60,
      data: 'data2',
    }])
    assert.deepStrictEqual(res, {})
  })

  it('getUserClients', async function () {
    const res = await client.getUserClients('59294da476d70b4b83fa91a0')

    assert.ok(res.total >= 0)
    assert.ok(res.android >= 0)
    assert.ok(res.ios >= 0)
    assert.ok(res.web >= 0)
  })

  it('sign', async function () {
    const res = await client.sign('59294da476d70b4b83fa91a0', 'web')
    assert.strictEqual(typeof res.token, 'string')
  })

  it('heartBeat', async function () {
    const res = await client.heartBeat()
    assert.strictEqual(typeof res.Name, 'string')
    assert.strictEqual(typeof res.Version, 'string')
  })
})
