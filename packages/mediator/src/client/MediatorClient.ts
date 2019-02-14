import Observable from 'zen-observable'
import { Command, Model, TransportRequestType } from '../common'
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
      sub.next(cached.value)
    } else {
      const subs = options.transports.map(transport => {
        return transport.observe(name, args).subscribe(
          response => {
            if (response.notFound !== true) {
              if (cached.args.type === 'many' && !Array.isArray(cached.rawValue)) {
                console.warn('mixed up cache')
                debugger
              }
              cached.update(response.result)
            }
          },
          error => sub.error(error),
          () => sub.complete(),
        )
      })
      cached.isActive = true
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
          cached.onDispose()
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
  ): Promise<ReturnType> {
    const name = typeof command === 'string' ? command : command.name

    for (let transport of this.options.transports) {
      const response = await transport.execute('command', {
        command: name,
        args,
      })
      if (response.notFound !== true) {
        return response.result
      }
    }

    throw new Error(`Command ${name} was not found`)
  }

  async save<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    values: SaveOptions<ModelType>,
  ): Promise<ModelType> {
    ObserverCache.updateModels(model, Array.isArray(values) ? values : [values])

    for (let transport of this.options.transports) {
      const response = await transport.execute('save', {
        model: model.name,
        args: values,
      })
      if (response.notFound !== true) {
        return response.result
      }
    }

    throw new Error(`save resolver for ${model.name} was not found`)
  }

  async remove<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    instance: ModelType,
  ): Promise<boolean> {
    for (let transport of this.options.transports) {
      const response = await transport.execute('remove', {
        model: model.name,
        args: instance,
      })
      if (response.notFound !== true) {
        return response.result
      }
    }

    throw new Error(`remove resolver for ${model.name} was not found`)
  }

  loadOne<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType>
  loadOne<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType>
  async loadOne<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const args = qm instanceof Query ? qm.args : options.args || {}

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadOne', {
        model: model.name,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        return response.result
      }
    }

    throw new Error(`loadOne resolver for ${model.name} was not found`)
  }

  loadMany<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType[]>
  loadMany<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType[]>
  async loadMany<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType[]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const args = qm instanceof Query ? qm.args : options.args || {}

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadMany', {
        model: model.name,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        return response.result
      }
    }

    throw new Error(`loadMany resolver for ${model.name} was not found`)
  }

  loadManyAndCount<ModelType, Args>(query: Query<ModelType, Args>): Promise<[ModelType[], number]>
  loadManyAndCount<ModelType, Args>(
    model: Model<ModelType, Args>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]>
  async loadManyAndCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]> {
    if (!options) options = {}

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadManyAndCount', {
        model: qm instanceof Query ? qm.model.name : qm.name,
        args: qm instanceof Query ? qm.args : options.args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        return response.result
      }
    }

    throw new Error(
      `loadManyAndCount resolver for ${
        qm instanceof Query ? qm.model.name : qm.name
      } was not found`,
    )
  }

  loadCount<ModelType, Args, CountArgs>(
    query: Query<ModelType, CountArgs>,
  ): Promise<[ModelType[], number]>
  loadCount<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: CountArgs
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]>
  async loadCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, CountArgs> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: CountArgs
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const args = qm instanceof Query ? qm.args : options.args || {}

    for (let transport of this.options.transports) {
      const response = await transport.execute('loadCount', {
        model: model.name,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      if (response.notFound !== true) {
        return response.result
      }
    }

    throw new Error(`loadCount resolver for ${model.name} was not found`)
  }

  observeOne<ModelType, Args>(query: Query<ModelType, Args>): Observable<ModelType>
  observeOne<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType>
  observeOne<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const args = qm instanceof Query ? qm.args : options.args || {}
    const cached = ObserverCache.get({ model, query: args, type: 'one', defaultValue: null })
    return new Observable(
      cachedObservable(
        'observeOne',
        {
          model: model.name,
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
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType[]>
  observeMany<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType[]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const args = qm instanceof Query ? qm.args : options.args || {}
    const cached = ObserverCache.get({ model, query: args, type: 'many', defaultValue: [] })
    return new Observable(
      cachedObservable(
        'observeMany',
        {
          model: model.name,
          args: args,
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
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<[ModelType[], number]>
  observeManyAndCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<[ModelType[], number]> {
    if (!options) options = {}
    return new Observable(subscriptionObserver => {
      const subscriptions = this.options.transports.map(transport => {
        return transport
          .observe('observeManyAndCount', {
            model: qm instanceof Query ? qm.model.name : qm.name,
            args: qm instanceof Query ? qm.args : options.args,
            resolvers: qm instanceof Query ? qm.args : options.resolvers,
          })
          .subscribe(
            response => {
              if (response.notFound !== true) {
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
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: CountArgs
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<number>
  observeCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, CountArgs> | Model<ModelType, Args, CountArgs>,
    options: {
      args?: CountArgs
      cacheValue?: any
      resolvers?: QueryOptions<ModelType>
    } = {},
  ): Observable<number> {
    if (!options) options = {}
    return new Observable(subscriptionObserver => {
      const subscriptions = this.options.transports.map(transport => {
        return transport
          .observe('observeCount', {
            model: qm instanceof Query ? qm.model.name : qm.name,
            args: qm instanceof Query ? qm.args : options.args,
          })
          .subscribe(
            response => {
              if (response.notFound !== true) {
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
}
