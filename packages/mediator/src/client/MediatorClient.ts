import { isDefined, orTimeout } from '@o/utils'
import Observable from 'zen-observable'

import { Command, Model, TransportRequestType } from '../common'
import { log } from '../common/logger'
import { ClientTransport } from './ClientTransport'
import { ObserverCache, ObserverCacheEntry } from './ObserverCache'
import { Query } from './Query'
import { QueryOptions } from './QueryOptions'
import { SaveOptions } from './SaveOptions'

export type MediatorClientOptions = {
  transports: ClientTransport[]
}

function cachedObservable(
  name: TransportRequestType,
  args: any,
  options: MediatorClientOptions,
  cached: ObserverCacheEntry,
) {
  return (sub: ZenObservable.SubscriptionObserver<any>) => {
    clearTimeout(cached.removeTimeout)
    cached.subscriptions.add(sub)

    if (cached.isActive) {
      if (cached.value !== undefined) {
        sub.next(cached.value)
      }
    } else {
      cached.isActive = true

      const subs = options.transports.map(transport => {
        return transport.observe(name, args).subscribe(
          response => {
            if (response.notFound !== true) {
              if (!isDefined(response.result)) {
                console.warn('undefined response result! Is this a weird bug?...')
              } else {
                cached.update(response.result)
              }
            }
          },
          error => sub.error(error),
          () => sub.complete(),
        )
      })
      cached.onDispose = () => {
        subs.forEach(subscription => subscription.unsubscribe())
      }
    }

    // remove subscription on cancellation
    return () => {
      cached.subscriptions.delete(sub)
      if (cached.subscriptions.size === 0) {
        cached.removeTimeout = setTimeout(() => {
          cached.isActive = false
          cached.onDispose && cached.onDispose()
          ObserverCache.delete(cached)
        }, 5000)
      }
    }
  }
}

export class MediatorClient {
  constructor(public options: MediatorClientOptions) {
    this.options = options
  }

  async command<Args, ReturnType>(
    command: Command<ReturnType, Args> | string,
    args?: Args,
    // we have a higher timeout for clients than for the server itself
    // so that if a client is down, the server still has time to go through many and finish them
    // see MediatorServer.command setting timeout
    options: { timeout?: number } = { timeout: 20000 },
  ): Promise<ReturnType> {
    const name = typeof command === 'string' ? command : command.name

    for (let transport of this.options.transports) {
      try {
        const response = await orTimeout(
          transport.execute('command', {
            command: name,
            args,
          }),
          options.timeout || 20000,
        )

        if (response && response.notFound === true) {
          if (response.error) {
            console.error('notFound response', response.error)
          }
        } else {
          return response.result
        }
      } catch (err) {
        console.error('command error', err)
      }
    }

    throw new Error(`Command ${name} was not found`)
  }

  async save<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    values: SaveOptions<ModelType>,
  ): Promise<ModelType> {
    const modelName = typeof model === 'string' ? model : model.name
    ObserverCache.updateModels(modelName, Array.isArray(values) ? values : [values])

    for (let transport of this.options.transports) {
      const response = await transport.execute('save', {
        model: modelName,
        args: values,
      })
      if (response.notFound !== true) {
        if (response.error) {
          log.error(response.error)
          throw new Error(response.error)
        }
        return response.result
      }
    }

    throw new Error(`save resolver for ${modelName} was not found`)
  }

  async remove<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    instance: ModelType,
  ): Promise<boolean> {
    const modelName = typeof model === 'string' ? model : model.name
    for (let transport of this.options.transports) {
      const response = await transport.execute('remove', {
        model: modelName,
        args: instance,
      })
      if (response.notFound !== true) {
        if (response.error) {
          log.error(response.error)
          throw new Error(response.error)
        }
        return response.result
      }
    }

    throw new Error(`remove resolver for ${modelName} was not found`)
  }

  loadOne<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType>
  loadOne<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType>
  async loadOne<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name
    const args = qm instanceof Query ? qm.args : options.args || {}

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadOne', {
        model: modelName,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        if (response.error) {
          log.error(response.error)
          throw new Error(response.error)
        }
        return response.result
      }
    }

    throw new Error(`loadOne resolver for ${modelName} was not found`)
  }

  loadMany<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType[]>
  loadMany<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType[]>
  async loadMany<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType[]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name
    const args = qm instanceof Query ? qm.args : options.args || {}

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadMany', {
        model: modelName,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        if (response.error) {
          log.error(response.error)
          throw new Error(response.error)
        }
        return response.result
      }
    }

    throw new Error(`loadMany resolver for ${modelName} was not found`)
  }

  loadManyAndCount<ModelType, Args>(query: Query<ModelType, Args>): Promise<[ModelType[], number]>
  loadManyAndCount<ModelType, Args>(
    model: Model<ModelType, Args> | string,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]>
  async loadManyAndCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadManyAndCount', {
        model: modelName,
        args: qm instanceof Query ? qm.args : options.args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        if (response.error) {
          log.error(response.error)
          throw new Error(response.error)
        }
        return response.result
      }
    }

    throw new Error(`loadManyAndCount resolver for ${modelName} was not found`)
  }

  loadCount<ModelType, Args, CountArgs>(
    query: Query<ModelType, CountArgs>,
  ): Promise<[ModelType[], number]>
  loadCount<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: CountArgs
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]>
  async loadCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, CountArgs> | Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: CountArgs
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name
    const args = qm instanceof Query ? qm.args : options.args || {}

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadCount', {
        model: modelName,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        if (response.error) {
          log.error(response.error)
          throw new Error(response.error)
        }
        return response.result
      }
    }

    throw new Error(`loadCount resolver for ${modelName} was not found`)
  }

  observeOne<ModelType, Args>(query: Query<ModelType, Args>): Observable<ModelType>
  observeOne<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType>
  observeOne<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name
    const args = qm instanceof Query ? qm.args : options.args || {}
    const cached = ObserverCache.get({
      model: modelName,
      query: args || {},
      type: 'one',
    })
    return new Observable(
      cachedObservable(
        'observeOne',
        {
          model: modelName,
          args,
          resolvers: qm instanceof Query ? qm.args : options.resolvers,
        },
        this.options,
        cached,
      ),
    )
  }

  observeMany<ModelType, Args>(query: Query<ModelType, Args>): Observable<ModelType[]>
  observeMany<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType[]>
  observeMany<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType[]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name
    const args = qm instanceof Query ? qm.args : options.args || {}
    const cached = ObserverCache.get({
      model: modelName,
      query: args || {},
      type: 'many',
    })
    return new Observable(
      cachedObservable(
        'observeMany',
        {
          model: modelName,
          args,
          resolvers: qm instanceof Query ? qm.args : options.resolvers,
        },
        this.options,
        cached,
      ),
    )
  }

  observeManyAndCount<ModelType, Args>(
    query: Query<ModelType, Args>,
  ): Observable<[ModelType[], number]>
  observeManyAndCount<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<[ModelType[], number]>
  observeManyAndCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs> | string,
    options: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    } = {},
  ): Observable<[ModelType[], number]> {
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name

    return new Observable(subscriptionObserver => {
      const subscriptions = this.options.transports.map(transport => {
        return transport
          .observe('observeManyAndCount', {
            model: modelName,
            args: qm instanceof Query ? qm.args : options.args,
            resolvers: qm instanceof Query ? qm.args : options.resolvers,
          })
          .subscribe(
            response => {
              if (response.notFound !== true) {
                if (response.error) {
                  log.error(response.error)
                  subscriptionObserver.error(response.error)
                  return
                }
                subscriptionObserver.next(response.result)
              }
            },
            error => subscriptionObserver.error(error),
            () => subscriptionObserver.complete(),
          )
      })

      // remove subscription on cancellation
      return () => subscriptions.forEach(subscription => subscription.unsubscribe())
    })
  }

  observeCount<ModelType, Args, CountArgs>(query: Query<ModelType, CountArgs>): Observable<number>
  observeCount<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs> | string,
    options?: {
      args?: CountArgs
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<number>
  observeCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, CountArgs> | Model<ModelType, Args, CountArgs> | string,
    options: {
      args?: CountArgs
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    } = {},
  ): Observable<number> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const modelName = typeof model === 'string' ? model : model.name

    return new Observable(subscriptionObserver => {
      const subscriptions = this.options.transports.map(transport => {
        return transport
          .observe('observeCount', {
            model: modelName,
            args: qm instanceof Query ? qm.args : options.args,
          })
          .subscribe(
            response => {
              if (response.notFound !== true) {
                if (response.error) {
                  log.error(response.error)
                  subscriptionObserver.error(response.error)
                  return
                }
                subscriptionObserver.next(response.result)
              }
            },
            error => subscriptionObserver.error(error),
            () => subscriptionObserver.complete(),
          )
      })

      // remove subscription on cancellation
      return () => {
        subscriptions.forEach(subscription => subscription.unsubscribe())
      }
    })
  }

  onData(): Observable<{ name: string; value: any }> {
    return new Observable(subscriptionObserver => {
      const subscriptions = this.options.transports.map(transport => {
        return transport.observe('data', {}).subscribe(
          response => {
            if (response.notFound !== true) {
              if (response.error) {
                log.error(response.error)
                subscriptionObserver.error(response.error)
                return
              }
              subscriptionObserver.next(response.result)
            }
          },
          error => subscriptionObserver.error(error),
          () => subscriptionObserver.complete(),
        )
      })

      // remove subscription on cancellation
      return () => subscriptions.forEach(subscription => subscription.unsubscribe())
    })
  }
}
