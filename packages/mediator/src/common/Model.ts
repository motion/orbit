
export class Model<ModelType, Args = {}, CountArgs = Args> {
  _model!: ModelType;
  _args!: Args;
  _countArgs!: CountArgs;

  constructor(public name: string) {
  }
}
