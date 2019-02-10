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
  return (subscriptionObserver: ZenObservable.SubscriptionObserver<any>) => {
    let masterSubscription
    cached.subscriptions.add(subscriptionObserver)

    if (cached.subscriptions.size > 1) {
      subscriptionObserver.next(cached.value)
    } else {
      masterSubscription = options.transports.map(transport => {
        return transport
          .observe(name, args)
          .subscribe(
            cached.update,
            error => subscriptionObserver.error(error),
            () => subscriptionObserver.complete(),
          )
      })
    }

    // remove subscription on cancellation
    return () => {
      cached.subscriptions.delete(subscriptionObserver)
      if (cached.subscriptions.size === 0) {
        masterSubscription.forEach(subscription => subscription.unsubscribe())
      }
    }
  }
}

export class MediatorClient {
  constructor(public options: MediatorClientOptions) {
    this.options = options
  }

  async command<Args, ReturnType>(
    command: Command<ReturnType, Args>,
    args?: Args,
  ): Promise<ReturnType> {
    const results = await Promise.all(
      this.options.transports.map(transport => {
        return transport.execute('command', {
          command: command.name,
          args,
        })
      }),
    )
    return results.filter(result => result !== undefined)[0]
  }

  async save<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    values: SaveOptions<ModelType>,
  ): Promise<ModelType> {
    ObserverCache.updateModels(model, Array.isArray(values) ? values : [values])

    return this.options.transports[0].execute('save', {
      model: model.name,
      args: values,
    })
  }

  async remove<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    instance: ModelType,
  ): Promise<boolean> {
    return this.options.transports[0].execute('remove', {
      model: model.name,
      args: instance,
    })
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
  loadOne<ModelType, Args, CountArgs>(
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
    return this.options.transports[0]
      .execute('loadOne', {
        model: model.name,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      .then(value => {
        // ModelCache.add(model, 'one', args, value)
        return value
      })
  }

  loadMany<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType[]>
  loadMany<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType[]>
  loadMany<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType[]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const args = qm instanceof Query ? qm.args : options.args || {}
    return this.options.transports[0]
      .execute('loadMany', {
        model: model.name,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      .then(value => {
        // ModelCache.add(model, 'many', args, value)
        return value
      })
  }

  loadManyAndCount<ModelType, Args>(query: Query<ModelType, Args>): Promise<[ModelType[], number]>
  loadManyAndCount<ModelType, Args>(
    model: Model<ModelType, Args>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]>
  loadManyAndCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]> {
    if (!options) options = {}
    return this.options.transports[0].execute('loadManyAndCount', {
      model: qm instanceof Query ? qm.model.name : qm.name,
      args: qm instanceof Query ? qm.args : options.args,
      resolvers: qm instanceof Query ? qm.args : options.resolvers,
    })
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
  loadCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, CountArgs> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: CountArgs
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<[ModelType[], number]> {
    if (!options) options = {}
    const model = qm instanceof Query ? qm.model : qm
    const args = qm instanceof Query ? qm.args : options.args || {}
    return this.options.transports[0]
      .execute('loadCount', {
        model: model.name,
        args,
        resolvers: qm instanceof Query ? qm.args : options.resolvers,
      })
      .then(value => {
        // ModelCache.add(model, 'count', args, value)
        return value
      })
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
          args: args,
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
            value => subscriptionObserver.next(value),
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
            subscriptionObserver.next,
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
