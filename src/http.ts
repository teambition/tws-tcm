'use strict'

import appRoot from 'app-root-path'
import UAComposer from 'user-agent-composer'
import { Client, ClientOptions, RetryOptions } from 'tws-auth'

const appInfo = require(`${appRoot}/package.json`)
const pkg = require('../package.json')
const UA = new UAComposer()
  .product(appInfo.name, appInfo.version)
  .ext('Node.js', process.version)
  .ext(pkg.name, pkg.version)
  .build()

export class HTTPClient extends Client {
  constructor (options: ClientOptions & RetryOptions) {
    super(options)
    this.UA = UA
  }

  subscribe<T> (topic: string, sessionId: string) {
    return this.post<T>(
      '/subscribe',
      { topic, s_id: sessionId },
    )
  }

  batchSubscribe<T> (body: any) {
    return this.post<T>(
      '/v1/subscribe:batch',
      body,
    )
  }

  unsubscribe<T> (topic: string, sessionId: string) {
    return this.post<T>(
      '/unsubscribe',
      { topic, s_id: sessionId },
    )
  }

  send<T> (body: any) {
    return this.post<T>(
      '/send',
      body,
    )
  }

  getUserClients<T> (userId: string) {
    return this.get<T>(`/users/${userId}/clients`)
  }

  sign<T> (userId: string, source: string) {
    return this.post<T>(
      `/users/${userId}/sign`,
      { source },
    )
  }

  heartBeat<T> () {
    return this.get<T>('/version')
  }
}
