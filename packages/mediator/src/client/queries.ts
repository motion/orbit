import { Model } from '../common'
import { Query } from './Query'
import { QueryOptions } from './QueryOptions'

export function query<ModelType, Args>(
  model: Model<ModelType, Args>,
  options: QueryOptions<ModelType>
): Query<ModelType, Args>;
export function query<ModelType, Args>(
  model: Model<ModelType, Args>,
  args: Args,
  options: QueryOptions<ModelType>
): Query<ModelType, Args>;
export function query<ModelType, Args>(
  model: Model<ModelType, Args>,
  argsOrOptions: Args|QueryOptions<ModelType>,
  maybeOptions?: QueryOptions<ModelType>
): Query<ModelType, Args> {
  const args = arguments.length === 3 ? argsOrOptions as Args : undefined;
  const options = arguments.length === 2 ? argsOrOptions : maybeOptions;
  return new Query(model, args, options);
}
