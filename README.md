# [tws-auth](https://github.com/teambition/tws-tcm)
Node.js SDK of TWS (Teambition Web Service) cloud messaging service.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

## Installation

```
npm i --save tws-tcm
```

## Usage

```js
'use strict'
const { TCMClient } = require('tws-tcm')

;(async function () {
  const client = new TCMClient({
    host: process.env.AUTH_SERVER,
    appId: process.env.APP_ID,
    appSecrets: [process.env.APP_SECRET],
    mode: 'grpc',
  })

  // HTTP
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

## Documentation

```js
const { TCMClient } = require('tws-tcm')
```

### new Client({ appId, appSecret[, host, timeout, cacheStore, rootCert, privateKey, certChain] })

- appId `String` : The ID of your TWS application.
- appSecrets: `[]String` : The secret passwords of your TWS application.
- host `String` : Optional, host URL of TWS authorization service, by default is `'https://auth.teambitionapis.com'`.
- timeout `Number` : Optional, requst timeout in milliseconds, by default is `3000`.
- rootCert `Buffer` : Optional, the client root certificate.
- privateKey `Buffer` : Optional, the client certificate private key.
- certChain `Buffer` : Optional, the client certificate cert chain.
- maxSockets `Number` : Optional, the client sockets.
- time `Boolean` : Optional, enable timing for request.
- retryDelay `Number` : Optional, delay time for retry, default to 200 ms.
- maxAttempts `Number` : Optional, max attempts for a request, default to 3 times.
- retryErrorCodes `[]String` : Optional, error codes that should retry, default to `['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN']`.
- mode `string`: use HTTP `http` or gRPC `grpc`, default to `http`

### TCMClient API
```ts
/**
 * Client for TWS (Teambition Web Service) cloud messaging service..
 */
export declare class TCMClient {
    private _client;
    constructor(options: TCMOptions);
    /**
     * subscribe a topic with given sessionId.
     * @param topic message topic.
     * @param sessionId user session ID.
     */
    subscribe(topic: string, sessionId: string): Promise<void>;
    /**
     * unsubscribe a topic with given sessionId.
     * @param topic message topic.
     * @param sessionId user session ID.
     */
    unsubscribe(topic: string, sessionId: string): Promise<void>;
    /**
     * send one or more messages.
     * @param body message array.
     */
    send(body: Message[]): Promise<void>;
    /**
     * get online info for given user.
     * @param userId user ID.
     */
    getUserClients(userId: string): Promise<UserClients>;
    /**
     * get a TCM token for given user.
     * @param userId user ID.
     * @param source client label.
     */
    sign(userId: string, source: string): Promise<Token>;
    /**
     * Just heart beat.
     */
    heartBeat(): Promise<HeartBeat>;
}
```

### More: https://teambition.github.io/tws-tcm/

## License
`tws-tcm` is licensed under the [MIT](https://github.com/teambition/tws-tcm/blob/master/LICENSE) license.
Copyright &copy; 2017-2018 Teambition.

[npm-url]: https://www.npmjs.com/package/tws-tcm
[npm-image]: https://img.shields.io/npm/v/tws-tcm.svg

[travis-url]: https://travis-ci.org/teambition/tws-tcm
[travis-image]: http://img.shields.io/travis/teambition/tws-tcm.svg

[downloads-url]: https://npmjs.org/package/tws-tcm
[downloads-image]: https://img.shields.io/npm/dm/tws-tcm.svg?style=flat-square
