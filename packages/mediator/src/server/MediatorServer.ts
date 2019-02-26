import { Command, Model, TransportRequest } from '../common'
import { ServerTransport } from './ServerTransport'
import { ResolveInterface } from './ResolveInterface'
import { MediatorClient, Subscription } from '..'
import { log } from '../common/logger'

export interface MediatorServerOptions {
  transport: ServerTransport
  fallbackClient?: MediatorClient
  resolvers: ResolveInterface<any, any, any>[]
  commands: Command<any, any>[]
  models: Model<any, any>[]
}

export class MediatorServer {
  private subscriptions: {
    id: string
    subscription: Subscription
  }[] = []
  dataIds: string[] = []

  constructor(public options: MediatorServerOptions) {}

  bootstrap() {
    this.options.transport.onMessage(data => this.handleMessage(data))
  }

  private async handleMessage(data: TransportRequest) {
    log.verbose('message', data)
    const onSuccess = result => {
      this.options.transport.send({
        id: data.id,
        result: result,
      })
    }
    const onError = (error: any) => log.error(`error in mediator: `, error)

    if (data.type === 'unsubscribe') {
      const subscriptions = this.subscriptions.filter(subscription => {
        return subscription.id === data.id
      })
      for (let subscription of subscriptions) {
        subscription.subscription.unsubscribe()
      }
      return
    }

    // we just store data ids for data type, then we use later to send message to those ids
    if (data.type === 'data') {
      this.dataIds.push(data.id)
      return
    }

    // find a command or a model
    let command: Command<any, any>, model: Model<any, any>
    if (data.type === 'command') {
      command = this.options.commands.find(command => {
        return command.name === data.command
      })
      // if command was not found - try fallback servers
      if (!command) {
        if (this.options.fallbackClient) {
          log.verbose(`command ${data.command} was not found, trying fallback clients`, data)
          this.options.fallbackClient
            .command(data.command, data.args)
            .then(onSuccess)
            .catch(onError)

        } else {
          log.verbose(`command ${data.command} was not found, no fallback client, ignoring`, data)
          this.options.transport.send({
            id: data.id,
            result: undefined,
            notFound: true,
          })
        }
        return
      }
    } else {
      model = this.options.models.find(model => {
        return model.name === data.model
      })
      // simply ignore if model was not found - maybe some other server has it defined
      if (!model) {

        if (this.options.fallbackClient) {
          log.verbose(`model ${data.model} was not found, trying fallback clients`, data)

          if (data.type === 'save') {
            this.options.fallbackClient
              .save(model, data.value)
              .then(onSuccess, onError)

          } else if (data.type === 'remove') {
            this.options.fallbackClient
              .remove(model, data.value)
              .then(onSuccess, onError)

          } else if (data.type === 'loadOne') {
            this.options.fallbackClient
              .loadOne(model, { args: data.args })
              .then(onSuccess, onError)

          } else if (data.type === 'loadMany') {
            this.options.fallbackClient
              .loadMany(model, { args: data.args })
              .then(onSuccess, onError)

          } else if (data.type === 'loadManyAndCount') {
            this.options.fallbackClient
              .loadManyAndCount(model, { args: data.args })
              .then(onSuccess, onError)

          } else if (data.type === 'loadCount') {
            this.options.fallbackClient
              .loadCount(model, { args: data.args })
              .then(onSuccess, onError)
          }

        } else {

          log.verbose(`model ${data.model} was not found`, data)
          this.options.transport.send({
            id: data.id,
            result: undefined,
            notFound: true,
          })

        }
        return
      }
    }

    // find a resolver
    const resolver = this.options.resolvers.find(resolver => {
      if (data.type === 'command') {
        return resolver.type === 'command' && resolver.command === command
      }
      if (data.type === 'save') {
        return resolver.type === 'save' && resolver.model === model
      }
      if (data.type === 'remove') {
        return resolver.type === 'remove' && resolver.model === model
      }
      if (data.type === 'loadOne') {
        return resolver.type === 'one' && resolver.model === model
      }
      if (data.type === 'loadMany') {
        return resolver.type === 'many' && resolver.model === model
      }
      if (data.type === 'loadManyAndCount') {
        return resolver.type === 'manyAndCount' && resolver.model === model
      }
      if (data.type === 'loadCount') {
        return resolver.type === 'count' && resolver.model === model
      }
      if (data.type === 'observeOne') {
        return resolver.type === 'observeOne' && resolver.model === model
      }
      if (data.type === 'observeMany') {
        return resolver.type === 'observeMany' && resolver.model === model
      }
      if (data.type === 'observeManyAndCount') {
        return resolver.type === 'observeManyAndCount' && resolver.model === model
      }
      if (data.type === 'observeCount') {
        return resolver.type === 'observeCount' && resolver.model === model
      }
      return false
    })

    if (resolver) {

      // resolve a value
      let result = null
      try {
        result = resolver.resolve(data.args)
      } catch (error) {
        log.error('error executing resolver', error)
        throw error
      }

      // additionally resolve properties

      // send result back over transport based on returned value
      if (
        data.type === 'observeOne' ||
        data.type === 'observeMany' ||
        data.type === 'observeManyAndCount' ||
        data.type === 'observeCount'
      ) {
        this.subscriptions.push({
          id: data.id,
          subscription: result.subscribe(onSuccess, onError)
        })

      } else if (result instanceof Promise) {
        result.then(onSuccess, onError)

      } else {
        onSuccess(result)
      }

      // if (command) {
      //   throw new Error(
      //     `No "${data.type}" resolver for the given ${command.name} command was found`,
      //   )
      // } else {
      //   throw new Error(`No "${data.type}" resolver for the given ${model.name} model was found`)
      // }
    }

    if (this.options.fallbackClient) {
      if (data.type === 'observeOne') {
        this.subscriptions.push({
          id: data.id,
          subscription: this.options.fallbackClient
            .observeOne(model, { args: data.args })
            .subscribe(onSuccess, onError)
        })

      } else if (data.type === 'observeMany') {
        this.subscriptions.push({
          id: data.id,
          subscription: this.options.fallbackClient
            .observeMany(model, { args: data.args })
            .subscribe(onSuccess, onError)
        })

      } else if (data.type === 'observeManyAndCount') {
        this.subscriptions.push({
          id: data.id,
          subscription: this.options.fallbackClient
            .observeManyAndCount(model, { args: data.args })
            .subscribe(onSuccess, onError)
        })

      } else if (data.type === 'observeCount') {
        this.subscriptions.push({
          id: data.id,
          subscription: this.options.fallbackClient
            .observeCount(model, { args: data.args })
            .subscribe(onSuccess, onError)
        })
      }
    }

  }
}
