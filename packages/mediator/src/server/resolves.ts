import { Command, Model } from '../common'
import { ResolveInterface } from './ResolveInterface'

export function resolveCommand<ModelType, Args>(
  command: Command<ModelType, Args>,
  resolve: (args: Args) => ModelType|Promise<ModelType>
): ResolveInterface<ModelType, undefined, Args> {
  return {
    command,
    resolve
  };
}

export function resolveOne<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => ModelType|Promise<ModelType>
): ResolveInterface<ModelType, undefined, Args> {
  return {
    model,
    resolve
  };
}

export function resolveMany<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (args: Args) => ModelType[]|Promise<ModelType[]>
): ResolveInterface<ModelType, undefined, Args> {
  return {
    many: true,
    model,
    resolve
  };
}

export function resolveModelProperty<ModelType, Property extends keyof ModelType, Args>(
  model: Model<ModelType, Args>,
  property: Property,
  resolve: (args: Args) => ModelType[Property]|Promise<ModelType[Property]>
): ResolveInterface<ModelType, Property, Args> {
  return {
    model,
    property,
    resolve
  };
}

export function resolveSave<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (model: ModelType) => ModelType|Promise<ModelType>
): ResolveInterface<ModelType, undefined, Args> {
  return {
    type: "save",
    model,
    resolve
  };
}

export function resolveRemove<ModelType, Args>(
  model: Model<ModelType, Args>,
  resolve: (model: ModelType) => boolean|Promise<boolean>
): ResolveInterface<ModelType, undefined, Args> {
  return {
    type: "remove",
    model,
    resolve
  };
}
