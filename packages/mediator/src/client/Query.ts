import { Model, QueryOptions } from '../index'

export class Query<ModelType, Args> {
  model: Model<ModelType, Args>
  args?: Args
  resolvers?: QueryOptions<ModelType>

  constructor(options: {
    model: Model<ModelType, Args>,
    args?: Args,
    resolvers?: QueryOptions<ModelType>
  }) {
    this.model = options.model
    this.args = options.args
    this.resolvers = options.resolvers
  }
}
