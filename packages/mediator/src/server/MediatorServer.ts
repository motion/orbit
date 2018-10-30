import { Command, Model, TransportRequest } from '../common'
import { ServerTransport } from './ServerTransport'
import { ResolveInterface } from './ResolveInterface'
import { Subscription } from '..'
import { log } from '../common/logger'

export interface MediatorServerOptions {
  transport: ServerTransport
  resolvers: ResolveInterface<any, any, any>[]
  commands: Command<any, any>[]
  models: Model<any, any>[]
}

export class MediatorServer {
  private subscriptions: {
    id: string
    subscription: Subscription
  }[] = []

  constructor(public options: MediatorServerOptions) {}

  bootstrap() {
    this.options.transport.onMessage(data => this.handleMessage(data))
  }

  private handleMessage(data: TransportRequest) {
    log.verbose('message', data)

    if (data.type === 'unsubscribe') {
      const subscription = this.subscriptions.find(subscription => {
        return subscription.id === data.id
      })
      if (subscription && subscription.subscription) {
        subscription.subscription.unsubscribe()
      }
      return
    }

    // find a command or a model
    let command: Command<any, any>, model: Model<any, any>
    if (data.type === 'command') {
      command = this.options.commands.find(command => {
        return command.name === data.command
      })
      // simply ignore if command was not found - maybe some other server has it defined
      if (!command) {
        log.verbose(`command ${data.command} was not found`, data)
        this.options.transport.send({
          id: data.id,
          result: undefined,
          notFound: true,
        })
        return
      }
    } else {
      model = this.options.models.find(model => {
        return model.name === data.model
      })
      // simply ignore if model was not found - maybe some other server has it defined
      if (!model) {
        log.verbose(`model ${data.model} was not found`, data)
        this.options.transport.send({
          id: data.id,
          result: undefined,
          notFound: true,
        })
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

    if (!resolver) {
      if (command) {
        throw new Error(
          `No "${data.type}" resolver for the given ${command.name} command was found`,
        )
      } else {
        throw new Error(`No "${data.type}" resolver for the given ${model.name} model was found`)
      }
    }

    // resolve a value
    const result = resolver.resolve(data.args)

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
        subscription: result.subscribe(
          result => {
            this.options.transport.send({
              id: data.id,
              result: result,
            })
          },
          error => {
            console.error('error in subscription result', error)
            throw error
          },
        ),
      })
    } else if (result instanceof Promise) {
      result
        .then(result => {
          this.options.transport.send({
            id: data.id,
            result: result,
          })
        })
        .catch(error => {
          console.error('error in promise result', error)
          throw error
        })
    } else {
      this.options.transport.send({
        id: data.id,
        result: result,
      })
    }
  }
}
