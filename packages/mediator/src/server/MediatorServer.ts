import { Command, Model } from '../common'
import { ServerTransportInterface } from './ServerTransportInterface'
import { ResolveInterface } from './ResolveInterface'

export interface MediatorServerOptions {
  transport: ServerTransportInterface
  resolvers: ResolveInterface<any, any, any>[]
  commands: Command<any, any>[]
  models: Model<any, any>[]
}

export class MediatorServer {
  constructor(public options: MediatorServerOptions) {
  }

  bootstrap() {
    this.options.transport.onMessage(data => {

      // do repository actions based on operation type
      switch (data.value.type) {
        case 'command':
          return this.handleCommand(data)

        case 'save':
          return this.handleSave(data)

        case 'remove':
          return this.handleRemove(data)

        case 'loadOne':
          return this.handleLoadOne(data)

        case 'loadMany':
          return this.handleLoadMany(data)

        // default:
          // throw new Error(`given operation "${data.type}" is not valid`)
      }
    });
  }

  private handleCommand(data: any) {
    const command = this.options.commands.find(command => {
      return command.name === data.value.command
    })
    if (!command)
      throw new Error(`Command ${data.value.command} was not found. Available commands: ${this.options.commands.map(command => command.name).join(", ")}`)
    const resolver = this.options.resolvers.find((resolver: any) => resolver.command && resolver.command === command)
    if (!resolver)
      throw new Error(`No resolver for the given ${command.name} command was found`)

    resolver.resolve(data.value.args).then(result => {
      this.options.transport.send({
        operationId: data.operationId,
        result: result
      })
    })
  }

  private handleSave(data: any) {
    const model = this.options.models.find(model => {
      return model.name === data.value.model
    })
    if (!model)
      throw new Error(`Model ${data.value.model} was not found. Available models: ${this.options.models.map(model => model.name).join(", ")}`)
    const resolver = this.options.resolvers.find((resolver: any) => {
      return resolver.type === "save" && resolver.model && resolver.model === model
    })
    if (!resolver)
      throw new Error(`No "save" resolver for the given ${model.name} model was found`)

    resolver.resolve(data.value.values).then(result => {
      this.options.transport.send({
        operationId: data.operationId,
        result: result
      })
    })
  }

  private handleRemove(data: any) {
    const model = this.options.models.find(model => {
      return model.name === data.value.model
    })
    if (!model)
      throw new Error(`Model ${data.value.model} was not found. Available models: ${this.options.models.map(model => model.name).join(", ")}`)
    const resolver = this.options.resolvers.find((resolver: any) => {
      return resolver.type === "remove" && resolver.model && resolver.model === model
    })
    if (!resolver)
      throw new Error(`No "remove" resolver for the given ${model.name} model was found`)

    resolver.resolve(data.value.values).then(result => {
      this.options.transport.send({
        operationId: data.operationId,
        result: result
      })
    })
  }

  private handleLoadOne(data: any) {
    const model = this.options.models.find(model => {
      return model.name === data.value.model
    })
    if (!model)
      throw new Error(`Model ${data.value.model} was not found. Available models: ${this.options.models.map(model => model.name).join(", ")}`)
    const resolver = this.options.resolvers.find((resolver: any) => {
      return resolver.type !== "remove" && resolver.type !== "save" && resolver.many !== true && resolver.model && resolver.model === model
    })
    if (!resolver)
      throw new Error(`No "one" resolver for the given ${model.name} model was found`)

    resolver.resolve(data.value.args).then(result => {
      this.options.transport.send({
        operationId: data.operationId,
        result: result
      })
    })
  }

  private handleLoadMany(data: any) {
    const model = this.options.models.find(model => {
      return model.name === data.value.model
    })
    if (!model)
      throw new Error(`Model ${data.value.model} was not found. Available models: ${this.options.models.map(model => model.name).join(", ")}`)
    const resolver = this.options.resolvers.find((resolver: any) => {
      return resolver.many === true && resolver.model && resolver.model === model
    })
    if (!resolver)
      throw new Error(`No "many" resolver for the given ${model.name} model was found`)

    resolver.resolve(data.value.args).then(result => {
      this.options.transport.send({
        operationId: data.operationId,
        result: result
      })
    })
  }
}