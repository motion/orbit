import { MediatorClient, Subscription } from '..'
import { Command, Model, TransportRequest } from '../common'
import { log } from '../common/logger'
import { ResolveInterface } from './ResolveInterface'
import { ServerTransport } from './ServerTransport'

export interface MediatorServerOptions {
  transport: ServerTransport
  fallbackClient?: MediatorClient
  resolvers: ResolveInterface<any, any, any>[]
  models: Model<any, any>[]
}

export class MediatorServer {
  private subscriptions: {
    id: string
    subscription: Subscription
  }[] = []
  dataIds: string[] = []
  commands: Command<any, any>[] = []

  constructor(public options: MediatorServerOptions) {
    log.verbose('Starting MediatorServer', options)
    this.commands = this.options.resolvers.flatMap(x => (x.type === 'command' ? [x.command] : []))
  }

  bootstrap() {
    log.verbose(`MediatorServer.bootstrap()`)
    this.options.transport.onMessage(data => this.handleMessage(data))
  }

  sendRemoteCommand<Args, ReturnType>(command: Command<ReturnType, Args> | string, args?: Args) {
    const name = typeof command === 'string' ? command : command.name
    if (this.options.fallbackClient) {
      this.options.fallbackClient.command(name, args, { timeout: 200 })
    }
  }

  private async handleMessage(data: TransportRequest) {
    log.verbose(`handleMessage`, data)
    // allow for hooks into before-finish command
    const onFinishCb = new Set<Function>()

    const onSuccess = result => {
      log.verbose(`onSuccess`, data, result)
      if (onFinishCb.size) {
        onFinishCb.forEach(cb => cb())
        onFinishCb.clear()
      }
      this.options.transport.send({
        id: data.id,
        result,
      })
    }

    const onError = (error: any) => {
      log.error(`error in mediator: `, data, error)
      this.options.transport.send({
        id: data.id,
        result: undefined,
        error: error.toString(),
      })
    }

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
    let command: Command<any, any> | undefined
    let model: Model<any, any> | undefined

    if (data.type === 'command') {
      command = this.commands.find(command => {
        return command.name === data.command
      })
      // if command was not found - try fallback servers
      if (!command) {
        if (this.options.fallbackClient) {
          log.verbose(`command ${data.command} was not found, trying fallback clients`, data)
          if (data.command) {
            this.options.fallbackClient
              .command(data.command, data.args, { timeout: 150 })
              .then(onSuccess)
              .catch(onError)
          }
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
      if (!model && data.model) {
        if (this.options.fallbackClient) {
          log.info(`model ${data.model} was not found, trying fallback clients`, data)

          if (data.type === 'save') {
            this.options.fallbackClient.save(data.model, data.value).then(onSuccess, onError)
          } else if (data.type === 'remove') {
            this.options.fallbackClient.remove(data.model, data.value).then(onSuccess, onError)
          } else if (data.type === 'loadOne') {
            this.options.fallbackClient
              .loadOne(data.model, { args: data.args })
              .then(onSuccess, onError)
          } else if (data.type === 'loadMany') {
            this.options.fallbackClient
              .loadMany(data.model, { args: data.args })
              .then(onSuccess, onError)
          } else if (data.type === 'loadManyAndCount') {
            this.options.fallbackClient
              .loadManyAndCount(data.model, { args: data.args })
              .then(onSuccess, onError)
          } else if (data.type === 'loadCount') {
            this.options.fallbackClient
              .loadCount(data.model, { args: data.args })
              .then(onSuccess, onError)
          } else if (data.type === 'observeOne') {
            this.subscriptions.push({
              id: data.id,
              subscription: this.options.fallbackClient
                .observeOne(data.model, { args: data.args })
                .subscribe(onSuccess, onError),
            })
          } else if (data.type === 'observeMany') {
            this.subscriptions.push({
              id: data.id,
              subscription: this.options.fallbackClient
                .observeMany(data.model, { args: data.args })
                .subscribe(onSuccess, onError),
            })
          } else if (data.type === 'observeManyAndCount') {
            this.subscriptions.push({
              id: data.id,
              subscription: this.options.fallbackClient
                .observeManyAndCount(data.model, { args: data.args })
                .subscribe(onSuccess, onError),
            })
          } else if (data.type === 'observeCount') {
            this.subscriptions.push({
              id: data.id,
              subscription: this.options.fallbackClient
                .observeCount(data.model, { args: data.args })
                .subscribe(onSuccess, onError),
            })
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
      let result: any = null

      try {
        const name = 'model' in resolver ? resolver.model.name : resolver.command.name
        const transport = this.options.transport
        result = resolver.resolve(data.args, {
          onFinishCommand(cb) {
            onFinishCb.add(cb)
          },
          sendMessage(message: string) {
            transport.send({
              id: data.id,
              message: true,
              result: message,
            })
          },
        })
        log.verbose(`Resolving ${resolver.type}: ${name}`, data.args)
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
        const subscription = result.subscribe(next => {
          if (next === undefined) {
            console.log(
              '----- GOT UNDEFIEND NEXT, either typeorm or workers fallback responding with no resolver? ------',
            )
            onSuccess(next)
          } else {
            onSuccess(next)
          }
        }, onError)
        this.subscriptions.push({
          id: data.id,
          subscription,
        })
      } else if (result instanceof Promise) {
        result.then(onSuccess, onError)
      } else {
        onSuccess(result)
      }
    }
  }
}
