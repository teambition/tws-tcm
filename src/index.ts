'use strict'

import { GRPCClient } from './grpc'
import { HTTPClient } from './http'
import { ClientOptions, RetryOptions } from 'tws-auth'

interface TCMMethods {
  subscribe<T> (topic: string, sessionId: string): Promise<T>
  unsubscribe<T> (topic: string, sessionId: string): Promise<T>
  send<T> (body: any): Promise<T>
  getUserClients<T> (_userId: string): Promise<T>
  sign<T> (_userId: string, source: string): Promise<T>
  heartBeat<T> (): Promise<T>
}

export type TCMOptions = ClientOptions & RetryOptions & { mode: string }

export interface UserClients {
  total: number
  android: number
  ios: number
  web: number
}

export interface Token {
  token: string
}

export interface Message {
  to: string // topic
  collapse_key: string
  time_to_live: number
  data: string
}

export interface Version {
  Name: string
  Version: string
  BuildTime: string
}

/**
 * Client for TWS (Teambition Web Service) cloud messaging service..
 */
export class TCMClient {
  private _client: TCMMethods
  constructor (options: TCMOptions) {
    let mode = 'http'
    if (options.mode != null && typeof options.mode === 'string') {
      mode = options.mode.toLowerCase()
    }

    this._client = mode === 'http' ? new HTTPClient(options) : new GRPCClient(options)
  }

  /**
   * subscribe a topic with given sessionId.
   * @param topic message topic.
   * @param sessionId user session ID.
   */
  subscribe (topic: string, sessionId: string) {
    return this._client.subscribe<{}>(topic, sessionId)
  }

  /**
   * unsubscribe a topic with given sessionId.
   * @param topic message topic.
   * @param sessionId user session ID.
   */
  unsubscribe (topic: string, sessionId: string) {
    return this._client.unsubscribe<{}>(topic, sessionId)
  }

  /**
   * send one or more messages.
   * @param body message array.
   */
  send (body: Message[]) {
    return this._client.send<{}>(body)
  }

  /**
   * get online info for given user.
   * @param userId user ID.
   */
  getUserClients (userId: string) {
    return this._client.getUserClients<UserClients>(userId)
  }

  /**
   * get a TCM token for given user.
   * @param userId user ID.
   * @param source client label.
   */
  sign (userId: string, source: string) {
    return this._client.sign<Token>(userId, source)
  }

  /**
   * Just heart beat.
   */
  heartBeat () {
    return this._client.heartBeat<Version>()
  }
}

export default TCMClient
