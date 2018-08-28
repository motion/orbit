import { Model, QueryOptions } from '../index'

export class Query<ModelType, Args> {
  _model!: ModelType;
  _args!: Args;

  constructor(
    public model: Model<ModelType, Args>,
    public args: Args|undefined,
    public options: QueryOptions<ModelType>
  ) {
  }
}