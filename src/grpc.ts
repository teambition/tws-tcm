'use strict'

import url from 'url'
import path from 'path'
import appRoot from 'app-root-path'
import UAComposer from 'user-agent-composer'
import {
  loadPackageDefinition, GrpcObject, Metadata, credentials as GrpcCredentials,
} from 'grpc'
import { Client, ClientOptions, RetryOptions, delay } from 'tws-auth'
import { loadSync } from '@grpc/proto-loader'

const PROTO_PATH = path.join(__dirname, '../proto/broker.proto')
const tcmDefinition = loadSync(PROTO_PATH, { defaults: true })

const appInfo = require(`${appRoot}/package.json`)
const pkg = require('../package.json')
const grpcpkg = require('grpc/package.json')
const UA = new UAComposer()
  .product(appInfo.name, appInfo.version)
  .ext('Node.js', process.version)
  .ext('gRPC', grpcpkg.version)
  .ext(pkg.name, pkg.version)
  .build()

export class GRPCClient  extends Client {
  private _outerBrokerClient: any
  constructor (options: ClientOptions & RetryOptions) {
    super(options)
    this.UA = UA

    let credentials
    const urlObj = url.parse(this.host)

    if (urlObj.protocol === 'http:') {
      credentials = GrpcCredentials.createInsecure()
    } else {
      credentials = GrpcCredentials.createSsl(
        options.rootCert as Buffer,
        options.privateKey as Buffer,
        options.certChain as Buffer,
      )
    }

    const grpcObject = loadPackageDefinition(tcmDefinition).outerbroker as GrpcObject
    const OuterBroker = (grpcObject.OuterBroker) as any

    this._outerBrokerClient = new OuterBroker(
      urlObj.host,
      credentials,
      { 'grpc.primary_user_agent': UA },
    )
  }

  subscribe<T> (topic: string, sessionId: string) {
    return this._grpc<T>('subscribe', { topic, s_id: sessionId })
  }

  unsubscribe<T> (topic: string, sessionId: string) {
    return this._grpc<T>('unsubscribe', { topic, s_id: sessionId })
  }

  send<T> (body: any) {
    return this._grpc<T>('send', body)
  }

  getUserClients<T> (userId: string) {
    return this._grpc<T>('listClients', { user_id: userId })
  }

  sign<T> (userId: string, source: string) {
    return this._grpc<T>('sign', { user_id: userId, source })
  }

  heartBeat<T> () {
    return this._grpc<T>('version', {}) // 暂时基于 http 请求
  }

  async _grpc<T> (method: string, args: any): Promise<T> {
    let err
    let attempts = 0
    const maxAttempts = this.requestOptions.maxAttempts
    const retryDelay = this.requestOptions.retryDelay
    const timeout = this.requestOptions.timeout
    const outerBrokerClient = this._outerBrokerClient
    const token = this.signAppToken()

    // NOTE: Retry when the error code of the response is 13 or 14
    // https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/constants.js#L135
    while (attempts < maxAttempts) {
      attempts++
      try {
        return await new Promise<T>((resolve, reject) => {
          const meta = new Metadata()
          meta.set('authorization', `Bearer ${token}`)

          outerBrokerClient[method](
            args, meta, { deadline: Date.now() + timeout },
            function (error: any, response: any) {
              if (error != null) {
                reject(error)
              } else {
                resolve(response)
              }
            })
        })
      } catch (error) {
        err = error
        if (error.code !== 14 && error.code !== 13) {
          break
        }
        await delay(retryDelay)
      }
    }

    throw err
  }
}
