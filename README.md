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
  const client = new Client({
    host: 'http://tcm.teambitionapis.com'
  })

  // HTTP
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

  // GRPC
  const grpcClient = new Client({
    host: 'http://tcm.teambitionapis.com',
    mode: 'GRPC'
  })
  await grpcClient.unsubscribe('some_topic', 'some_session_id', 'access_token')
})(console.error)
```

## API

### Class: Client

new Client({ host, [timeout, certPath, privateKey, certChain] })

- host `String` : Host URL of TWS cloud messaging service, by default is `'https://tcm.teambitionapis.com'`.
- timeout `Number` : Optional, requst timeout in milliseconds, by default is `2000`.
- mode `String` : Whether to use `HTTP` or `GRPC`, by default if `HTTP`.
- rootCert `Buffer` : Optional, the client root certificate.
- privateKey `Buffer` : Optional, the client certificate private key.
- certChain `Buffer` : Optional, the client certificate cert chain.
- addUUID `Boolean`: Optional, whether to add an uuid to the querystring when using HTTP.

#### Class Method: subscribe(topic, _sessionId, token)

#### Class Method: unsubscribe(topic, _sessionId, token)

#### Class Method: send(body, token)

#### Class Method: getUserClients(_userId, token)

#### Class Method: sign(_userId, source, token)

#### Class Method: heartBeat(token)
