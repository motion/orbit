import { Command, Model } from '../common'

export type ResolveInterface<ModelType, Property extends keyof ModelType, Args> = {
  model: Model<ModelType, Args>;
  resolve: (args: Args) => ModelType|Promise<ModelType>;
} | {
  model: Model<ModelType, Args>;
  many: true;
  resolve: (args: Args) => ModelType[]|Promise<ModelType[]>;
} | {
  command: Command<ModelType, Args>;
  resolve: (args: Args) => ModelType|Promise<ModelType>;
} | {
  model: Model<ModelType, Args>;
  property: Property;
  resolve: (args: Args) => ModelType[Property]|Promise<ModelType[Property]>;
} | {
  type: "save",
  model: Model<ModelType, Args>;
  resolve: (model: ModelType) => ModelType|Promise<ModelType>;
} | {
  type: "remove",
  model: Model<ModelType, Args>;
  resolve: (model: ModelType) => boolean|Promise<boolean>;
}