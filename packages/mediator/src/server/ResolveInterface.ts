import Observable from 'zen-observable'

import { Command, Model } from '../common'

export type ResolveType =
  | 'command'
  | 'one'
  | 'many'
  | 'manyAndCount'
  | 'count'
  | 'property'
  | 'save'
  | 'remove'
  | 'observeOne'
  | 'observeMany'
  | 'observeManyAndCount'
  | 'observeCount'

export type CommandOpts = {
  sendMessage: (message: string) => void
  onFinishCommand: (cb: Function) => void
}

export type ResolveCommand<ModelType, Args> = {
  type: 'command'
  command: Command<ModelType, Args>
  resolve: (args: Args, opts: CommandOpts) => ModelType | Promise<ModelType>
}

export type ResolveOne<ModelType, Args> = {
  type: 'one'
  model: Model<ModelType, Args>
  resolve: (args: Args) => ModelType | Promise<ModelType>
}

export type ResolveMany<ModelType, Args> = {
  type: 'many'
  model: Model<ModelType, Args>
  resolve: (args: Args) => ModelType[] | Promise<ModelType[]>
}

export type ResolveManyAndCount<ModelType, Args> = {
  type: 'manyAndCount'
  model: Model<ModelType, Args>
  resolve: (args: Args) => [ModelType[], number] | Promise<[ModelType[], number]>
}

export type ResolveCount<ModelType, Args> = {
  type: 'count'
  model: Model<ModelType, Args>
  resolve: (args: Args) => number | Promise<number>
}

export type ResolveProperty<ModelType, Property extends keyof ModelType, Args> = {
  type: 'property'
  model: Model<ModelType, Args>
  property: Property
  resolve: (args: Args) => ModelType[Property] | Promise<ModelType[Property]>
}

export type ResolveSave<ModelType, Args> = {
  type: 'save'
  model: Model<ModelType, Args>
  resolve: (args: ModelType) => ModelType | Promise<ModelType>
}

export type ResolveRemove<ModelType, Args> = {
  type: 'remove'
  model: Model<ModelType, Args>
  resolve: (args: ModelType) => boolean | Promise<boolean>
}

export type ResolveObserveOne<ModelType, Args> = {
  type: 'observeOne'
  model: Model<ModelType, Args>
  resolve: (args: Args) => Observable<ModelType>
}

export type ResolveObserveMany<ModelType, Args> = {
  type: 'observeMany'
  model: Model<ModelType, Args>
  resolve: (args: Args) => Observable<ModelType[]>
}

export type ResolveObserveManyAndCount<ModelType, Args> = {
  type: 'observeManyAndCount'
  model: Model<ModelType, Args>
  resolve: (args: Args) => Observable<[ModelType[], number]>
}

export type ResolveObserveCount<ModelType, Args> = {
  type: 'observeCount'
  model: Model<ModelType, Args>
  resolve: (args: Args) => Observable<number>
}

export type ResolveInterface<ModelType, Property extends keyof ModelType, Args> =
  | ResolveCommand<ModelType, Args>
  | ResolveOne<ModelType, Args>
  | ResolveMany<ModelType, Args>
  | ResolveManyAndCount<ModelType, Args>
  | ResolveCount<ModelType, Args>
  | ResolveProperty<ModelType, Property, Args>
  | ResolveSave<ModelType, Args>
  | ResolveRemove<ModelType, Args>
  | ResolveObserveOne<ModelType, Args>
  | ResolveObserveMany<ModelType, Args>
  | ResolveObserveManyAndCount<ModelType, Args>
  | ResolveObserveCount<ModelType, Args>
