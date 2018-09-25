import Observable from 'zen-observable'
import { Command, Model } from '../common'
import { ClientTransport } from './ClientTransport'
import { Query } from './Query'
import { QueryOptions } from './QueryOptions'
import { SaveOptions } from './SaveOptions'
// import Observable = require("zen-observable");

export type MediatorClientOptions = {
  transports: ClientTransport[]
}

export class MediatorClient {
  constructor(public options: MediatorClientOptions) {
  }

  async command<Args, ReturnType>(
    command: Command<ReturnType, Args>,
    args?: Args,
  ): Promise<ReturnType> {
    const results = await this.options.transports.map(transport => {
      return transport.execute('command', {
        command: command.name,
        args,
      })
    })
    return results.filter(result => result !== undefined)[0]
  }

  async save<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    values: SaveOptions<ModelType>,
  ): Promise<ModelType> {
    return this.options.transports[0].execute('save', {
      model: model.name,
      args: values
    })
  }

  async remove<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    instance: ModelType,
  ): Promise<boolean> {
    return this.options.transports[0].execute('remove', {
      model: model.name,
      args: instance
    })
  }

  loadOne<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType>
  loadOne<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType>
  loadOne<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Promise<ModelType> {
    if (!options) options = {}
    return this.options.transports[0].execute('loadOne', {
      model: qm instanceof Query ? qm.model.name : qm.name,
      args: qm instanceof Query ? qm.args : options.args,
      resolvers: qm instanceof Query ? qm.args : options.resolvers,
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
    return this.options.transports[0].execute('loadMany', {
      model: qm instanceof Query ? qm.model.name : qm.name,
      args: qm instanceof Query ? qm.args : options.args,
      resolvers: qm instanceof Query ? qm.args : options.resolvers,
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
    return this.options.transports[0].execute('loadCount', {
      model: qm instanceof Query ? qm.model.name : qm.name,
      args: qm instanceof Query ? qm.args : options.args,
      resolvers: qm instanceof Query ? qm.args : options.resolvers,
    })
  }

  observeOne<ModelType, Args>(query: Query<ModelType, Args>): Observable<ModelType>
  observeOne<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType>
  observeOne<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType> {
    if (!options) options = {}
    return new Observable(subscriptionObserver => {

      const subscriptions = this.options.transports.map(transport => {
        return transport.observe('observeOne', {
          model: qm instanceof Query ? qm.model.name : qm.name,
          args: qm instanceof Query ? qm.args : options.args,
          resolvers: qm instanceof Query ? qm.args : options.resolvers,
        }).subscribe(
          value => subscriptionObserver.next(value),
          error => subscriptionObserver.error(error),
          () => subscriptionObserver.complete()
        )
      })

      // remove subscription on cancellation
      return () => subscriptions.forEach(subscription => subscription.unsubscribe())
    });
  }

  observeMany<ModelType, Args>(query: Query<ModelType, Args>): Observable<ModelType[]>
  observeMany<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType[]>
  observeMany<ModelType, Args, CountArgs>(
    qm: Query<ModelType, Args> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: Args
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<ModelType[]> {
    if (!options) options = {}
    return new Observable(subscriptionObserver => {

      const subscriptions = this.options.transports.map(transport => {
        return transport.observe('observeMany', {
          model: qm instanceof Query ? qm.model.name : qm.name,
          args: qm instanceof Query ? qm.args : options.args,
          resolvers: qm instanceof Query ? qm.args : options.resolvers,
        }).subscribe(
          value => subscriptionObserver.next(value),
          error => subscriptionObserver.error(error),
          () => subscriptionObserver.complete()
        )
      })

      // remove subscription on cancellation
      return () => subscriptions.forEach(subscription => subscription.unsubscribe())
    });
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
        return transport.observe('observeManyAndCount', {
          model: qm instanceof Query ? qm.model.name : qm.name,
          args: qm instanceof Query ? qm.args : options.args,
          resolvers: qm instanceof Query ? qm.args : options.resolvers,
        }).subscribe(
          value => subscriptionObserver.next(value),
          error => subscriptionObserver.error(error),
          () => subscriptionObserver.complete()
        )
      })

      // remove subscription on cancellation
      return () => subscriptions.forEach(subscription => subscription.unsubscribe())
    });
  }

  observeCount<ModelType, Args, CountArgs>(query: Query<ModelType, CountArgs>): Observable<number>
  observeCount<ModelType, Args, CountArgs>(
    model: Model<ModelType, Args, CountArgs>,
    options?: {
      args?: CountArgs
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<number>
  observeCount<ModelType, Args, CountArgs>(
    qm: Query<ModelType, CountArgs> | Model<ModelType, Args, CountArgs>,
    options?: {
      args?: CountArgs
      resolvers?: QueryOptions<ModelType>
    },
  ): Observable<number> {
    if (!options) options = {}
    return new Observable(subscriptionObserver => {

      const subscriptions = this.options.transports.map(transport => {
        return transport.observe('observeCount', {
          model: qm instanceof Query ? qm.model.name : qm.name,
          args: qm instanceof Query ? qm.args : options.args,
        }).subscribe(
          value => subscriptionObserver.next(value),
          error => subscriptionObserver.error(error),
          () => subscriptionObserver.complete()
        )
      })

      // remove subscription on cancellation
      return () => subscriptions.forEach(subscription => subscription.unsubscribe())
    });
  }
}
