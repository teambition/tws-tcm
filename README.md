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

;(async function () {
  const client = new Client({ host: 'https://tcm.teambitionapis.com' })

  await client.subscribe('some_topic', 'some_session_id', 'access_token')
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
  }], 'access_token')
})(console.error)
```

## API

### Class: Client

new Client({ host })

- host `String` : Host URL of TWS cloud messaging service, by default is `'https://tcm.teambitionapis.com'`.

#### Class Method: subscribe(topic, _sessionId)

#### Class Method: unsubscribe(topic, _sessionId)

#### Class Method: send(body)

#### Class Method: getUserClients(_userId)

#### Class Method: sign(_userId, source, expire)
