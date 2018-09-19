export class Command<ModelType, Args = {}> {
  _model!: ModelType
  _args!: Args

  constructor(public name: string) {}
}
