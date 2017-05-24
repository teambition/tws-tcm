# tws-tcm
[![Build Status](https://travis-ci.org/teambition/tws-tcm.svg?branch=master)](https://travis-ci.org/teambition/tws-tcm)

Node.js SDK of TWS (Teambition Web Service) cloud messaging service.

## Installation

```
npm install tws-tcm
```

## Usage

```js
'use strict'
const Client = require('tws-tcm')
const RedisStore = require('tws-auth/cache/redis')

;(async function () {
  const client = new Client({
    authHost: 'https://auth.teambitionapis.com',
    host: 'https://tcm.teambitionapis.com',
    cacheStore: new RedisStore({ addrs: ['127.0.0.1:6379'] }),
    appId: '78f95e92c06a546f7dab7327',
    appSecret: 'app_secret',
    resourceType: 'app'
  })

  await client.subscribe('some_topic', 'some_session_id')
  await client.send([{
    to: 'some_topic',
    collapse_key: 'collapse_key',
    time_to_live: 60,
    data: 'data1'
  }, {
    to: 'some_topic',
    collapse_key: 'collapse_key',
    time_to_live: 60,
    data: 'data2'
  }])
})(console.error)
```

## API

### Class: Client

new Client({ authHost, host, appId, appSecret, resourceType[, cacheStore] })

- authHost `String` : Host URL of TWS authorization service, by default is `'https://auth.teambitionapis.com'`.
- host `String` : Host URL of TWS cloud messaging service, by default is `'https://tcm.teambitionapis.com'`.
- appId `String` : The ID of your TWS application.
- appSecret: `String` : The secret password of your TWS application.
- resourceType `String` : Resource type of your TWS application, by default is `'app'`.
- cacheStore `Object` : Optional, the cache store for TWS access token, if provided, it should be an instance of `require('tws-auth/cache/store')` .

#### Class Method: subscribe(topic, _sessionId)

#### Class Method: unsubscribe(topic, _sessionId)

#### Class Method: send(body)

#### Class Method: getUserClients(_userId)

#### Class Method: sign(_userId, source, expire)
