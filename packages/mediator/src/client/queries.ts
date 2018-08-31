import { Model } from '../common'
import { Query } from './Query'
import { QueryOptions } from './QueryOptions'

export function query<ModelType, Args>(
  model: Model<ModelType, Args>,
  options?: {
    args?: Args,
    resolvers?: QueryOptions<ModelType>
  }
): Query<ModelType, Args> {
  if (!options) options = {}
  return new Query({
    model: model,
    args: options.args,
    resolvers: options.resolvers,
  });
}
