import { Command, Model } from '../common'
import { ClientTransportInterface } from './ClientTransportInterface'
import { Query } from './Query'
import { SaveOptions } from './SaveOptions'

export interface MediatorClientOptions {
  transport: ClientTransportInterface;
}

export class MediatorClient {
  constructor(public options: MediatorClientOptions) {
  }

  async command<Args, ReturnType>(
    command: Command<ReturnType, Args>,
    args?: Args,
  ): Promise<ReturnType> {

    return this.options.transport.execute({
      type: 'command',
      command: command.name,
      args
    })
  }

  async save<ModelType, Args>(
    model: Model<ModelType, Args>,
    values: SaveOptions<ModelType>
  ): Promise<ModelType> {

    return this.options.transport.execute({
      type: 'save',
      model: model.name,
      values
    })
  }

  async remove<ModelType, Args>(model: Model<ModelType, Args>, instance: ModelType): Promise<boolean> {
    return this.options.transport.execute({
      type: 'remove',
      model: model.name,
      instance
    })
  }

  async loadOne<ReturnType, Args>(
    query: Query<ReturnType, Args>
  ): Promise<ReturnType> {

    return this.options.transport.execute({
      type: 'loadOne',
      model: query.model.name,
      args: query.args,
      query: query.options
    })
  }

  async loadMany<ReturnType, Args>(
    query: Query<ReturnType, Args>,
  ): Promise<ReturnType[]> {
    return this.options.transport.execute({
      type: 'loadMany',
      model: query.model.name,
      args: query.args,
      query: query.options
    })
  }

  async subscribeOne<ReturnType, Args>(
    query: Query<ReturnType, Args>,
  ): Observable<ReturnType> {
    return {} as any
  }

  async subscribeMany<ReturnType, Args>(
    query: Query<ReturnType, Args>,
  ): Observable<ReturnType> {
    return []
  }

}
