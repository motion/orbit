import Observable from 'zen-observable'

import { Command, Model } from '../common'
import { ResolveInterface, CommandOpts } from './ResolveInterface'

export function resolveCommand<ModelType, Args>(
  command: Command<ModelType, Args>,
  resolve: (args: Args, opts: CommandOpts) => ModelType | Promise<ModelType>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'command',
    command,
    resolve,
  }
}

export function resolveOne<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => ModelType | Promise<ModelType>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'one',
    model,
    resolve,
  }
}

export function resolveMany<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => ModelType[] | Promise<ModelType[]>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'many',
    model,
    resolve,
  }
}

export function resolveManyAndCount<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => [ModelType[], number] | Promise<[ModelType[], number]>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'manyAndCount',
    model,
    resolve,
  }
}

export function resolveCount<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => number | Promise<number>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'count',
    model,
    resolve,
  }
}

export function resolveProperty<ModelType, Property extends keyof ModelType, Args>(
  model: Model<ModelType, Args>,
  property: Property,
  resolve: (args: Args) => ModelType[Property] | Promise<ModelType[Property]>,
): ResolveInterface<ModelType, Property, Args> {
  return {
    type: 'property',
    model,
    property,
    resolve,
  }
}

export function resolveSave<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: ModelType) => ModelType | Promise<ModelType>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'save',
    model,
    resolve,
  }
}

export function resolveRemove<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: ModelType) => boolean | Promise<boolean>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'remove',
    model,
    resolve,
  }
}

export function resolveObserveOne<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => Observable<ModelType>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'observeOne',
    model,
    resolve,
  }
}

export function resolveObserveMany<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => Observable<ModelType[]>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'observeMany',
    model,
    resolve,
  }
}

export function resolveObserveManyAndCount<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => Observable<[ModelType[], number]>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'observeManyAndCount',
    model,
    resolve,
  }
}

export function resolveObserveCount<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => Observable<number>,
): ResolveInterface<ModelType, never, Args> {
  return {
    type: 'observeCount',
    model,
    resolve,
  }
}
